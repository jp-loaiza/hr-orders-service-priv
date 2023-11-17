import { Order, OrderUpdate, Transaction } from "../orders"
import client from 'ssh2-sftp-client'
import { validateOrder } from '../validation'
import {
  MAXIMUM_RETRIES,
  ORDER_CUSTOM_FIELDS,
  PAYMENT_STATES,
  TRANSACTION_TYPES,
  TRANSACTION_STATES,
  JESTA_ORDER_STATUSES,
  SENT_TO_ALGOLIA_STATUSES,
  SENT_TO_CJ_STATUSES,
  SENT_TO_DYNAMIC_YIELD_STATUSES,
  SENT_TO_NARVAR_STATUSES,
  SENT_TO_SEGMENT_STATUSES,
  JOB_TASK_TIMEOUT,
  NARVAR_MONIKERS,
} from '../constants'
import {
  fetchOrdersThatShouldBeSentToOms,
  setOrderAsSentToOms,
  setOrderCustomField,
  setOrderCustomFields,
  setOrderErrorFields,
  fetchOrdersThatShouldBeUpdatedInOMS,
  fetchOrdersWhoseTrackingDataShouldBeSentToAlgolia,
  fetchOrdersWhoseConversionsShouldBeSentToCj,
  fetchOrdersWhosePurchasesShouldBeSentToDynamicYield,
  fetchOrdersThatShouldBeSentToNarvar,
  fetchStates,
  fetchShipments,
  fetchOrdersToSendToSegment,
} from '../commercetools/commercetools'
import { sendOrderUpdateToJesta } from '../jesta/jesta'
import { generateCsvStringFromOrder } from '../csv/csv'
import {
  sftpConfig,
  SFTP_INCOMING_ORDERS_PATH,
  shouldUploadOrders,
  shouldSendNotifications,
  shouldCheckForStuckOrders,
  shouldSendOrderUpdates,
} from '../config'
import { sendManyConversionsToAlgolia, getConversionsFromOrder } from '../algolia/algolia'
import { getDYReportEventFromOrder, sendPurchaseEventToDynamicYield } from '../dynamicyield/dynamicYield'
import { convertOrderForNarvar, sendToNarvar, shouldSendToNarvarFinalCut } from '../narvar/narvar'
import { getCrmCustomerId, getOrderData } from '../segment/segment'
import { sendSegmentTrackCall, sendSegmentIdentifyCall } from '../segment/segment.utils'
import logger, { serializeError } from '../logger'
import { sendOrderConversionToCj } from "../cj/cj"
import { Response } from 'express';
import {
  sendOrderEmailNotificationByOrder,
} from "../emails/email"
import {
  canLogStuckOrder,
  canSendConversionToAlgolia,
  canSendConversionToCJ,
  canSendOrderEmailNotification,
  canSendOrderToNarvar,
  canSendOrderToSegment,
  canSendOrderUpdate,
  canSendPurchaseEventToDY,
  canUploadCsv
} from "./validationService"
import tracer, { hydrateOrderSpanTags, spanSetError } from '../tracer'
import { State } from "@commercetools/platform-sdk"

/**
 *
 * @param {number} ms time to sleep in ms
 */
export async function sleep(ms: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}

const NoResponse = Symbol.for('no-response')

// TODO implement retry as a generic function so that the type of args matches the parameters expected by fn
/**
 *
 * @param {Function} fn
 * @param {number} maxRetries
 * @param {number} backoff in ms
 */
export function retry(fn: Function, maxRetries: number = MAXIMUM_RETRIES, backoff: number = 1000) {
  return ( /** @param {any[]} args */ async function (...args: any) {
    let tries = 0
    let error = null
    let response = NoResponse
    while (response === NoResponse && tries < maxRetries) {
      tries++
      error = null
      response = NoResponse
      try {
        if (tries > 1) {
          console.warn(`Retrying failed call to function ${fn.name} with arguments ${args}`)
          await sleep(tries * backoff)
        }
        response = await fn(...args)
      } catch (err) {
        error = err
      }
    }
    if (error) {
      throw error
    }
    return response
  })
}

/**
 *
 * @param {Array<import('../orders').Transaction>} transactions
 * @param {string} type
 * @param {string} state
 */
const getTransaction = (type: string, state: string, transactions?: Transaction[]) =>
  transactions && transactions.find(transaction => transaction.type === type && transaction.state === state)

export const transformToOrderPayment = (order: Order) => {
  const orderUpdate: OrderUpdate = {
    orderNumber: order.orderNumber,
  }

  // Checking for fully discounted orders
  if (order.paymentState && order.paymentState.toLowerCase() === PAYMENT_STATES.PAID && order.totalPrice.centAmount === 0) {
    return { ...orderUpdate, status: 'Success' }
  }

  const creditPaymentInfo = order.paymentInfo?.payments.find(payment => payment.obj?.paymentMethodInfo.method === 'credit')
  if (!creditPaymentInfo) {
    orderUpdate.errorMessage = 'No credit card payment with payment release change'
    console.error(`Failed to find credit payment info for order ${order.orderNumber}: `, JSON.stringify(order.paymentInfo, null, 3))
    return orderUpdate
  }

  const interfaceCode = creditPaymentInfo.obj?.paymentStatus.interfaceCode
  let transaction = null
  if (interfaceCode === PAYMENT_STATES.PREAUTHED) { // delayed capture is ON and DM accepted
    transaction = getTransaction(TRANSACTION_TYPES.AUTHORIZATION, TRANSACTION_STATES.SUCCESS, creditPaymentInfo.obj?.transactions)
  } else if (interfaceCode === PAYMENT_STATES.CANCELLED) { // delated capture is ON or OFF but DM rejected
    transaction = getTransaction(TRANSACTION_TYPES.AUTHORIZATION, TRANSACTION_STATES.FAILURE, creditPaymentInfo.obj?.transactions)
      || getTransaction(TRANSACTION_TYPES.CHARGE, TRANSACTION_STATES.FAILURE, creditPaymentInfo.obj?.transactions)
  } else if (interfaceCode === PAYMENT_STATES.PAID) { // delayed capture is OFF and DM accepted
    transaction = getTransaction(TRANSACTION_TYPES.CHARGE, TRANSACTION_STATES.SUCCESS, creditPaymentInfo.obj?.transactions)
  }

  if (!transaction) {
    orderUpdate.errorMessage = `Order update is not for a status that jesta recognizes: ${interfaceCode}`
    console.error(`Failed to set transaction for order ${order.orderNumber}: `, JSON.stringify(creditPaymentInfo.obj?.transactions, null, 3))
    return orderUpdate
  }

  return { ...orderUpdate, status: transaction.state }
}

/**
 *
 * @param {import('@commercetools/platform-sdk').Order} order
 * @explain JESTA expects CSV filenames to be of the form `Orders-YYYY-MM-DD-HHMMSS<orderNumber>.csv`.
 */
export const generateFilenameFromOrder = (order: Order) => {
  const orderDate = new Date(order.createdAt)
  const dateString = order.createdAt.slice(0, 10)
  const timeString = [orderDate.getUTCHours(), orderDate.getUTCMinutes(), orderDate.getUTCSeconds()]
    .map(timeComponent => timeComponent.toString().padStart(2, '0'))
    .join('')

  return `Orders-${dateString}-${timeString}${order.orderNumber}.csv`
}

async function createAndUploadCsv(order: Order, sftp: client) {
  await tracer.trace('order_service_job', { resource: 'order_upload_csv' }, async () => {
    hydrateOrderSpanTags(order)
    try {
      let csvString
      try {
        if (!validateOrder(order)) throw new Error('Invalid order')
        csvString = generateCsvStringFromOrder(order)
      } catch (err) {
        spanSetError(err)
        const orderNumber = order.orderNumber
        const errorMessage =
          err instanceof Error && err.message === `Invalid order: ${orderNumber}` ?
            JSON.stringify(validateOrder.errors) : `Unable to generate CSV for order ${orderNumber}: `
        logger.error({
          type: 'order_validation_failure',
          message: errorMessage,
          error: await serializeError(err),
        })

        await retry(setOrderErrorFields)(order, errorMessage, true, {
          retryCountField: ORDER_CUSTOM_FIELDS.RETRY_COUNT,
          nextRetryAtField: ORDER_CUSTOM_FIELDS.NEXT_RETRY_AT,
          statusField: ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS
        })

        return
      }

      try {
        logger.info(`Attempting to upload CSV to JESTA for order ${order.orderNumber}`)
        if (csvString) {
          await sftp.put(Buffer.from(csvString), SFTP_INCOMING_ORDERS_PATH + generateFilenameFromOrder(order))
        } else {
          throw new Error('Failed to upload CSV to JESTA')
        }

        logger.info(`Successfully uploaded CSV to JESTA for order ${order.orderNumber}`)
      } catch (err) {
        spanSetError(err)
        logger.error({
          type: 'upload_csv_failure',
          message: `Unable to upload CSV to JESTA for order ${order.orderNumber}`,
          stack: serializeError(err)
        })
        await retry(setOrderErrorFields)(order, 'Unable to upload CSV to JESTA', true, {
          retryCountField: ORDER_CUSTOM_FIELDS.RETRY_COUNT,
          nextRetryAtField: ORDER_CUSTOM_FIELDS.NEXT_RETRY_AT,
          statusField: ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS
        })

        return
      }
      await setOrderAsSentToOms(order, ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS)
    } catch (error) {
      spanSetError(error)
      logger.error({
        type: 'process_orders_failure',
        message: 'Unable to process orders',
        error: serializeError(error),
      })
    }
  })
}

export const createAndUploadCsvs = async () => {
  const sftp = new client()
  try {
    await sftp.connect(sftpConfig)
    logger.info('Connected to SFTP server')
    const { orders, total } = await fetchOrdersThatShouldBeSentToOms()
    if (orders.length === 0) return

    logger.info(`Starting to process ${orders.length} orders (total in backlog: ${total})`)

    let exportedOrders = 0
    await tracer.trace('order_service_job_batch', { resource: 'order_upload_csv_batch' }, async () => {
      for (const order of orders) {
        await createAndUploadCsv(order, sftp)
        exportedOrders++
      }
    })

    logger.warn({
      type: 'orders_ct_total',
      ct_total: total
    })

    logger.warn({
      type: 'orders_ct_exported',
      ct_exported: exportedOrders
    })

    logger.info('Done processing orders')
  } catch (err) {
    logger.error({
      type: 'process_orders_failure',
      message: 'Unable to process orders',
      error: serializeError(err),
    })
  } finally {
    if (sftp) {
      await sftp.end()
        .catch(function (err: any) {
          logger.error({
            type: 'sftp_connection_failure',
            message: 'Unable to end SFTP connection',
            error: serializeError(err),
          })
        })
    }
  }
}

async function sendOrderUpdate(order: Order) {
  await tracer.trace('order_service_job', { resource: 'order_update' }, async () => {
    hydrateOrderSpanTags(order)

    try {
      const orderPayment = transformToOrderPayment(order)
      if (orderPayment.errorMessage || !orderPayment.orderNumber) {
        await retry(setOrderErrorFields)(order, orderPayment.errorMessage, true, {
          retryCountField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_RETRY_COUNT,
          nextRetryAtField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_NEXT_RETRY_AT,
          statusField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_STATUS
        })
      } else {
        const orderStatus = orderPayment.status === TRANSACTION_STATES.SUCCESS ? JESTA_ORDER_STATUSES.RELEASED : JESTA_ORDER_STATUSES.CANCELLED
        const cartSourceWebsite = order.custom?.fields.cartSourceWebsite ? order.custom?.fields.cartSourceWebsite : ''

        await sendOrderUpdateToJesta(orderPayment.orderNumber, orderStatus, cartSourceWebsite)
        // we retry in case the version of the order has changed by CSV job
        await retry(setOrderAsSentToOms)(order, ORDER_CUSTOM_FIELDS.OMS_UPDATE_STATUS)
      }
    } catch (error) {
      spanSetError(error)
      logger.error({
        type: 'order_update_failure',
        message: `Failed to send order update to jesta for order number: ${order.orderNumber}`,
        error: serializeError(error)
      })
      // we retry in case the version of the order has changed by CSV job
      await retry(setOrderErrorFields)(order, error instanceof Error ? error.message : '', true, {
        retryCountField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_STATUS
      })
    }
  })
}

export async function sendOrderUpdates() {
  const { orders, total } = await fetchOrdersThatShouldBeUpdatedInOMS()
  if (orders.length === 0) {
    return
  }
  logger.info(`Sending ${orders.length} order updates to OMS (total in backlog: ${total}): ${JSON.stringify(orders)}`)
  await tracer.trace('order_service_job_batch', { resource: 'order_update_batch' }, async () => {
    await Promise.all(orders.map(async orderToUpdate => {
      await sendOrderUpdate(orderToUpdate)
    }))
  })
}

async function sendConversionToAlgolia(order: Order) {
  await tracer.trace('order_service_job', { resource: 'algolia_conversion_update' }, async () => {
    hydrateOrderSpanTags(order)
    try {
      const conversions = getConversionsFromOrder(order)
      await sendManyConversionsToAlgolia(conversions)
      logger.info(`Sent Algolia conversion updates for order ${order.orderNumber}`)
      await retry(setOrderCustomField)(order.id, 'sentToAlgoliaStatus', SENT_TO_ALGOLIA_STATUSES.SUCCESS)
    } catch (error) {
      spanSetError(error)
      logger.error({
        type: 'algolia_conversion_error',
        message: `Failed to send Algolia conversion updates for order ${order.orderNumber}`,
        error: await serializeError(error)
      })
      await retry(setOrderErrorFields)(order, error instanceof Error ? error.message : '', true, {
        retryCountField: ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_STATUS
      })
    }
  })
}

export async function sendConversionsToAlgolia() {
  const { orders, total } = await fetchOrdersWhoseTrackingDataShouldBeSentToAlgolia()

  if (total === 0) {
    logger.info('No orders with conversion data to send to Algolia.')
    return
  }

  logger.info(`Sending conversion data to Algolia. ${total} orders for which to send conversion data.`)

  await tracer.trace('order_service_job_batch', { resource: 'algolia_conversion_update_batch' }, async () => {
    for (const order of orders) {
      await sendConversionToAlgolia(order)
      await sleep(100) // prevent CT/Algolia from getting overloaded
    }
  })
}

async function sendPurchaseEventToDY(order: Order) {
  await tracer.trace('order_service_job', { resource: 'dynamic_yield_event' }, async () => {
    hydrateOrderSpanTags(order)
    try {
      const dynamicYieldEventData = getDYReportEventFromOrder(order)
      if (dynamicYieldEventData != undefined) {
        await sendPurchaseEventToDynamicYield(dynamicYieldEventData)
        logger.info(`Sent Dynamic Yield purchase event for order ${order.orderNumber}`)
        await retry(setOrderCustomField)(order.id, ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS, SENT_TO_DYNAMIC_YIELD_STATUSES.SUCCESS)
      }
    } catch (error) {
      spanSetError(error)
      logger.error({
        type: 'dynamic_yield_purchase_events_failure',
        message: `Failed to send Dynamic Yield purchase event for order ${order.orderNumber}`,
        error: await serializeError(error)
      })
      await retry(setOrderErrorFields)(order, error instanceof Error ? error.message : '', true, {
        retryCountField: ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS
      })
    }
  })
}

export async function sendPurchaseEventsToDynamicYield() {
  const { orders, total } = await fetchOrdersWhosePurchasesShouldBeSentToDynamicYield()

  if (total === 0) {
    logger.info('No orders with purchase data to send to Dynamic Yield.')
    return
  }

  logger.info(`Sending purchase data to Dynamic Yield. ${total} orders for which to send purchase data.`)

  await tracer.trace('order_service_job_batch', { resource: 'dynamic_yield_event_batch' }, async () => {
    for (const order of orders) {
      await sendPurchaseEventToDY(order)
      await sleep(100) // prevent CT/Dynamic Yield from getting overloaded
    }
  })
}

// @todo HRC-6313 Remove this once optimized query has been validated.
const NARVAR_DISABLE_UPDATE = process.env.NARVAR_DISABLE_UPDATE === 'true' ? true : false

async function sendOrderToNarvar(order: Order, states: State[]) {
  await tracer.trace('order_service_job', { resource: 'order_narvar' }, async () => {
    hydrateOrderSpanTags(order)
    if (!order.orderNumber) {
      throw new Error(`Order Number does not exist on ${order.id}`)
    }

    try {
      const shipments = await fetchShipments(order.orderNumber)
      const narvarOrder = await convertOrderForNarvar(order, shipments, states)

      if (narvarOrder && !NARVAR_DISABLE_UPDATE) {
        const now = new Date().valueOf()
        await sendToNarvar(narvarOrder)
        logger.info(`Order Successfully Sent to NARVAR: ${order.orderNumber}`)

        const actions = [
          {
            action: 'setCustomField',
            name: ORDER_CUSTOM_FIELDS.NARVAR_STATUS,
            value: SENT_TO_NARVAR_STATUSES.SUCCESS
          },
          {
            action: 'setCustomField',
            name: ORDER_CUSTOM_FIELDS.NARVAR_LAST_SUCCESS_TIME,
            value: new Date(now).toJSON()
          }
        ]

        if (shouldSendToNarvarFinalCut(narvarOrder)) {
          actions.push({
            action: 'setCustomField',
            name: ORDER_CUSTOM_FIELDS.NARVAR_MONIKER,
            value: NARVAR_MONIKERS['997'],
          })
        } else {
          actions.push({
            action: 'setCustomField',
            name: ORDER_CUSTOM_FIELDS.NARVAR_MONIKER,
            value: NARVAR_MONIKERS['990'],
          })
        }

        await retry(setOrderCustomFields)(order.id, order.version.toString(), actions)
        logger.info(`Narvar status fields for order: ${order.orderNumber} set successfully`)
      }
    } catch (error) {
      spanSetError(error)
      logger.error({
        type: 'error',
        message: `Failed to send order ${order.orderNumber}: to Narvar`,
        error: await serializeError(error)
      })

      await retry(setOrderErrorFields)(order, error instanceof Error ? error.message : '', true, {
        retryCountField: ORDER_CUSTOM_FIELDS.NARVAR_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.NARVAR_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.NARVAR_STATUS
      })
    }
  })
}

export async function sendOrdersToNarvar() {
  const states = await fetchStates()
  const { orders, total } = await fetchOrdersThatShouldBeSentToNarvar()

  if (total === 0) {
    logger.info('No orders found to send to Narvar.')
    return
  }

  logger.info(`Fetched ${orders.length} orders to be sent to Narvar, total= ${total}`)

  await tracer.trace('order_service_job_batch', { resource: 'order_narvar_batch' }, async () => {
    for await (const order of orders) {
      if (!order.orderNumber) {
        //Skip this order if no order number
        continue
      }
      await sendOrderToNarvar(order, states)
    }
  })
}

async function sendConversionToCJ(order: Order) {
  try {
    await sendOrderConversionToCj(order)
    await retry(setOrderCustomField)(order.id, ORDER_CUSTOM_FIELDS.CJ_CONVERSION_STATUS, SENT_TO_CJ_STATUSES.SUCCESS)
    logger.info(`OrderConversionToCj job successfully processed order ${order.orderNumber}`)
  } catch (error) {
    logger.error({
      type: 'process_order_failure',
      message: `OrderConversionToCj job failed to process order ${order.orderNumber}`,
      error: await serializeError(error)
    })
  }
}

/**
 * @param {{name: string, fetchRelevantOrders: function, processOrder: function, retryCountField: string, nextRetryAtField: string, statusField: string, statuses: {SUCCESS: string, FAILURE: string, PENDING: string} }} params
 */
function createJob({
  name,
  fetchRelevantOrders,
  processOrder,
  retryCountField,
  nextRetryAtField,
  statusField,
  statuses
}: {
  name: string;
  fetchRelevantOrders: Function;
  processOrder: Function;
  retryCountField: string;
  nextRetryAtField: string;
  statusField: string;
  statuses: { SUCCESS: string; FAILURE: string; PENDING: string }
}) {
  async function processOrders() {
    const { orders, total } = await fetchRelevantOrders()
    logger.info(total > 0 ? `Processing orders for ${name} job (total in backlog: ${total}).` : `No orders for ${name} job to process.`)
    for (const order of orders) {
      try {
        await processOrder(order)
        await retry(setOrderCustomField)(order.id, statusField, statuses.SUCCESS)
        logger.info(`${name} job successfully processed order ${order.orderNumber}`)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ''
        logger.error({
          type: 'process_order_failure',
          message: `${name} job failed to process order ${order.orderNumber}`,
          error: await serializeError(error)
        })
        await retry(setOrderErrorFields)(order, errorMessage || JSON.stringify(error), true, { retryCountField, nextRetryAtField, statusField })
      }
    }
  }

  return async function startJob(/** @type {number} **/ interval: number) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await processOrders()
      } catch (error) {
        logger.error({
          type: 'job_failure',
          message: `Unexpected ${name} job error`,
          error: await serializeError(error),
        })
      }
      await sleep(interval)
    }
  }
}

export const startCjConversionJob = createJob({
  name: 'CJ conversions',
  fetchRelevantOrders: fetchOrdersWhoseConversionsShouldBeSentToCj,
  processOrder: sendOrderConversionToCj,
  retryCountField: ORDER_CUSTOM_FIELDS.CJ_CONVERSION_RETRY_COUNT,
  nextRetryAtField: ORDER_CUSTOM_FIELDS.CJ_CONVERSION_NEXT_RETRY_AT,
  statusField: ORDER_CUSTOM_FIELDS.CJ_CONVERSION_STATUS,
  statuses: SENT_TO_CJ_STATUSES
})

type orderData = {
  loginradius_id: string,
  email?: string,
  first_name?: string,
  last_name?: string,
  phone_number?: string,
}

const getIdentifyTraitsFromOrder = (order: orderData) => {
  return {
    loginradius_id: order.loginradius_id,
    email: order.email,
    first_name: order.first_name,
    last_name: order.last_name,
    phone_number: order.phone_number,
  }
}

async function sendOrderToSegment(order: Order) {
  await tracer.trace('order_service_job', { resource: 'order_segment' }, async () => {
    hydrateOrderSpanTags(order)
    try {
      const orderData = await getOrderData(order)
      const customerId = await getCrmCustomerId(order)
      const anonymousId = orderData.anonymous_id
      const segmentUserId = customerId ?? orderData.anonymous_id
      const orderDataWithCustomerId = {
        ...orderData,
        customer_id: customerId,
        user_id: customerId,
      };
      var eventName = ''
      if (!order.custom?.fields.segmentOrderState) {
        eventName = 'Order Created'
        sendSegmentTrackCall(eventName, customerId, anonymousId, orderDataWithCustomerId)
        sendSegmentIdentifyCall(customerId, anonymousId, getIdentifyTraitsFromOrder(orderDataWithCustomerId))
        logger.info(`Sent Segment Call for order: ${order.orderNumber}, with segmentUserId ${segmentUserId} and segment payload ${orderDataWithCustomerId}`)
      } else if (order.orderState === 'Cancelled') {
        eventName = 'Order Cancelled'
        sendSegmentTrackCall(eventName, customerId, anonymousId, orderDataWithCustomerId)
        logger.info(`Sent Segment Call for order: ${order.orderNumber}, with segmentUserId ${segmentUserId} and segment payload ${orderDataWithCustomerId}`)
      }
      else if (order.orderState !== order.custom.fields.segmentOrderState) {
        eventName = 'Order Modified'
        sendSegmentTrackCall(eventName, customerId, anonymousId, orderDataWithCustomerId)
        logger.info(`Sent Segment Call for order: ${order.orderNumber}, with segmentUserId ${segmentUserId} and segment payload ${orderDataWithCustomerId}`)
      }
      await retry(setOrderCustomField)(order.id, ORDER_CUSTOM_FIELDS.SEGMENT_STATUS, SENT_TO_SEGMENT_STATUSES.SUCCESS)
      await retry(setOrderCustomField)(order.id, ORDER_CUSTOM_FIELDS.SEGMENT_ORDER_STATE, orderData.order_state)
    } catch (error) {
      spanSetError(error)
      logger.error({
        type: 'error',
        message: `Failed to send order event for order ${order.orderNumber}`,
        error: serializeError(error),
      })
      await retry(setOrderErrorFields)(order, error instanceof Error ? error.message : '', true, {
        retryCountField: ORDER_CUSTOM_FIELDS.SEGMENT_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.SEGMENT_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.SEGMENT_STATUS,
      })
    }
  })
}

//Sending order events to Segment
export async function sendOrdersToSegment() {
  const { orders, total } = await fetchOrdersToSendToSegment()

  if (total === 0) {
    logger.info('No orders with purchase data to send to Segment.')
    return
  }

  logger.info(`Sending purchase events to Segment. ${total} orders pending.`)

  await tracer.trace('order_service_job_batch', { resource: 'order_segment_batch' }, async () => {
    for (const order of orders) {
      await sendOrderToSegment(order)
      await sleep(100) // prevent Segment from getting overloaded
    }
  })
}

export function logStuckOrdersUtil(order: Order) {
  logger.warn({
    type: 'stuck_orders',
    stuck_orders: 1,
    message: `Found stuck order # ${order.orderNumber}, id: ${order.id}`
  })
}

export const lastJobsRunTime = {
  createAndUploadCsvsJob: new Date(),
  sendOrderEmailNotificationJob: new Date(),
  checkForStuckOrdersJob: new Date(),
  sendOrderUpdatesJob: new Date()
}

type JobTime = {
  createAndUploadCsvsJob?: Date;
  sendOrderEmailNotificationJob?: Date;
  checkForStuckOrdersJob?: Date;
  sendOrderUpdatesJob?: Date;
}

const getEnabledJobsLastExecutionTime = () => {
  const lastEnabledJobsRunTime: JobTime = {}
  if (shouldUploadOrders) lastEnabledJobsRunTime.createAndUploadCsvsJob = lastJobsRunTime.createAndUploadCsvsJob
  if (shouldSendNotifications) lastEnabledJobsRunTime.sendOrderEmailNotificationJob = lastJobsRunTime.sendOrderEmailNotificationJob
  if (shouldCheckForStuckOrders) lastEnabledJobsRunTime.checkForStuckOrdersJob = lastJobsRunTime.checkForStuckOrdersJob
  if (shouldSendOrderUpdates) lastEnabledJobsRunTime.sendOrderUpdatesJob = lastJobsRunTime.sendOrderUpdatesJob
  return lastEnabledJobsRunTime
}

export const jobTotalTimeout = (MAXIMUM_RETRIES + 1) * JOB_TASK_TIMEOUT

export function checkJobsHealth(res: Response) {
  const enabledJobsLastExecutionTime = getEnabledJobsLastExecutionTime();
  const currentTime = new Date();
  for (const job in enabledJobsLastExecutionTime) {
    const lastExecutionTime = (enabledJobsLastExecutionTime[(job) as keyof JobTime])?.getTime()
    if (lastExecutionTime && ((currentTime.getTime() - lastExecutionTime) > jobTotalTimeout + 1000)) {
      logger.error({
        type: 'health_check',
        message: `${job} failed to run in a timely manner. Current Time: ${currentTime.getTime()}, last execution times: ${lastExecutionTime}.`
      });
      res.status(500).send('failed');
      return false;
    }
  }
  return true;
}

export const orderMessageDisperse = async (order: Order) => {
  try {
    if (canUploadCsv(order)) {
      const sftp = new client()
      await sftp.connect(sftpConfig)
      logger.info('Connected to SFTP server')
      createAndUploadCsv(order, sftp)
    }

    if (canSendOrderUpdate(order)) {
      sendOrderUpdate(order)
    }

    if (canSendOrderEmailNotification(order)) {
      sendOrderEmailNotificationByOrder(order)
    }

    if (canSendConversionToAlgolia(order)) {
      sendConversionToAlgolia(order)
    }

    if (canSendOrderToNarvar(order)) {
      const states = await fetchStates()
      sendOrderToNarvar(order, states)
    }

    if (canSendPurchaseEventToDY(order)) {
      sendPurchaseEventToDY(order)
    }

    if (canSendOrderToSegment(order)) {
      sendOrderToSegment(order)
    }

    if (canSendConversionToCJ(order)) {
      sendConversionToCJ(order)
    }

    if (canLogStuckOrder(order)) {
      logStuckOrdersUtil(order)
    }
  } catch (error) {
    logger.error({
      type: 'order_disperse',
      message: 'failure to disperse message',
      error: serializeError(error)
    })
  }
}


