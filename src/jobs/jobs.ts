import logger, { serializeError } from "../logger"
import { Order } from "../orders"

require('dotenv').config()
import tracer from '../tracer'

const {
  ORDER_UPDATE_INTERVAL,
  ORDER_UPLOAD_INTERVAL,
  SEND_NOTIFICATIONS_INTERVAL,
  STUCK_ORDER_CHECK_INTERVAL,
  SEND_ALGOLIA_INFO_INTERVAL,
  SEND_CJ_CONVERSIONS_INTERVAL,
  SEND_DYNAMIC_YIELD_INFO_INTERVAL,
  SEND_NARVAR_ORDERS_INTERVAL,
  SEND_SEGMENT_ORDERS_INTERVAL } = (/** @type {import('../orders').Env} */ (process.env))
import {
  createAndUploadCsvs,
  sendConversionsToAlgolia,
  sendPurchaseEventsToDynamicYield,
  sendOrdersToNarvar,
  sendOrderUpdates,
  sleep,
  retry,
  startCjConversionJob,
  sendOrdersToSegment
} from './jobs.utils'
import {
  fetchOrderIdsThatShouldBeSentToCrm,
  setOrderSentToCrmStatus,
  fetchStuckOrderResults
} from '../commercetools/commercetools'
import { sendOrderEmailNotificationByOrderId } from '../emails/email'
import { MAXIMUM_RETRIES, JOB_TASK_TIMEOUT } from '../constants'

const timeoutSymbol = Symbol('timeout')

const jobTotalTimeout = (MAXIMUM_RETRIES + 1) * JOB_TASK_TIMEOUT
logger.info(`Jobs total timeout set to: ${jobTotalTimeout}ms`)

const lastJobsRunTime = {
  createAndUploadCsvsJob: new Date(),
  sendOrderEmailNotificationJob: new Date(),
  checkForStuckOrdersJob: new Date(),
  sendOrderUpdatesJob: new Date()
}

/**
 * @param {number} orderUploadInterval interval between each job in ms
 */
async function createAndUploadCsvsJob(orderUploadInterval: number) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.time('Create and uploads CSVs')
    try {
      const result = await Promise.race([
        createAndUploadCsvs(),
        sleep(jobTotalTimeout).then(() => timeoutSymbol)
      ])
      if (result === timeoutSymbol) {
        throw new Error(`Sending orders to OMS timedout after ${jobTotalTimeout}ms.`)
      }
    } catch (error) {
      logger.error({
        type: 'upload_csv_failure',
        message: 'Failed to create and uploads CSVs',
        error: serializeError(error)
      })
    }
    console.timeEnd('Create and uploads CSVs')
    await sleep(orderUploadInterval)
    lastJobsRunTime.createAndUploadCsvsJob = new Date()
  }
}

/**
 * @param {number} orderUploadInterval interval between each job in ms
 */
async function sendOrderUpdatesJob(orderUploadInterval: number) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await Promise.race([
        sendOrderUpdates(),
        sleep(jobTotalTimeout).then(() => timeoutSymbol)
      ])
      if (result === timeoutSymbol) {
        throw new Error(`Sending order update requests to OMS timedout after ${jobTotalTimeout}ms.`)
      }
    } catch (error) {
      logger.error({
        type: 'order_updates_oms_failure',
        message: 'Failed to send order updates to OMS',
        error: serializeError(error)
      })
    }
    await sleep(orderUploadInterval)
    lastJobsRunTime.sendOrderUpdatesJob = new Date()
  }
}


async function sendOrderEmailNotification() {
  const { orderIds, total } = await fetchOrderIdsThatShouldBeSentToCrm()
  if (orderIds.length) {
    console.log(`Sending ${orderIds.length} orders to CRM (total in backlog: ${total}): ${orderIds}`)
  }
  await Promise.all(orderIds.map(async (orderId: string) => {
    try {
      await sendOrderEmailNotificationByOrderId(orderId)
      // we retry in case the version of the order has changed by CSV job
      await retry(setOrderSentToCrmStatus)(orderId, true)
    } catch (error) {
      logger.error({
        type: 'order_email_notification_failure',
        message: `Failed to send order email notification to CRM for orderID:${orderId}`,
        error: serializeError(error)
      })
      // we retry in case the version of the order has changed by CSV job
      await retry(setOrderSentToCrmStatus)(orderId, false)
    }
  }))
}

/**
 * @param {*} sendNotificationsInterval interval between each job in ms
 */
async function sendOrderEmailNotificationJob(sendNotificationsInterval: number) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await Promise.race([
        sendOrderEmailNotification(),
        sleep(jobTotalTimeout).then(() => timeoutSymbol)
      ])
      if (result === timeoutSymbol) {
        throw new Error(`Sending notification requests to OMS timedout after ${jobTotalTimeout}ms.`)
      }
    } catch (error) {
      logger.error({
        type: 'order_email_notification_failure',
        message: 'Failed to send notification requests to OMS',
        error: serializeError(error)
      })
    }
    await sleep(sendNotificationsInterval)
    lastJobsRunTime.sendOrderEmailNotificationJob = new Date()
  }
}

/**
 * @param {*} stuckOrderCheckInterval interval between each job in ms
 */
async function checkForStuckOrdersJob(stuckOrderCheckInterval: number) {
  //eslint-disable-next-line no-constant-condition
  while (true) {
    const { results: stuckOrders, total: stuckOrderCount } = await fetchStuckOrderResults()

    if (stuckOrderCount > 0) {
      const stringifiedStuckOrderNumbersAndIds = stuckOrders.map((order: Order) => (JSON.stringify({ orderNumber: order.orderNumber, id: order.id })))
      logger.info(`Found stuck orders ${stuckOrders.length}`)
      logger.warn(`Found stuck orders (total: ${stuckOrderCount}): [${stringifiedStuckOrderNumbersAndIds.join(', ')}]`)

    } else {
      logger.info('No stuck orders')
    }
    lastJobsRunTime.checkForStuckOrdersJob = new Date()
    await sleep(stuckOrderCheckInterval)
  }
}

/**
 * @param {number} sendToAlgoliaInterval
 */
async function sendConversionsToAlgoliaJob(sendToAlgoliaInterval: number) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await sendConversionsToAlgolia()
    }
    catch (error) {
      logger.error({
        type: 'send_to_algolia_failure',
        message: 'Failed to send conversion to Algolia',
        error: serializeError(error)
      })
    }
    await sleep(sendToAlgoliaInterval)
  }
}

/**
 * @param {number} sendToDynamicYieldInterval
 */
async function sendPurchaseEventsToDynamicYieldJob(sendToDynamicYieldInterval: number) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await sendPurchaseEventsToDynamicYield()
    }
    catch (error) {
      logger.error({
        type: 'send_to_dynamic_yield_failure',
        message: 'Failed to send purchase events to Dynamic Yield',
        error: serializeError(error)
      })
    }
    await sleep(sendToDynamicYieldInterval)
  }
}

/**
 * @param {number} sendToNarvarInterval
 */
async function sendOrdersToNarvarJob(sendToNarvarInterval: number) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await sendOrdersToNarvar()
    }
    catch (error) {
      logger.error({
        type: 'send_to_narvar_failure',
        message: 'Failed to send orders to Narvar',
        error: serializeError(error)
      })
    }
    await sleep(sendToNarvarInterval)
  }
}

/**
 * @param {number} sendToSegmentInterval
 */
async function sendOrdersToSegmentJob(sendToSegmentInterval: number) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await sendOrdersToSegment()
    }
    catch (error) {
      logger.error({
        type: 'segment_orders_failure',
        message: 'Unable to send orders to Segment',
        error: serializeError(error)
      })
    }
    await sleep(sendToSegmentInterval)
  }
}

const shouldUploadOrders = process.env.SHOULD_UPLOAD_ORDERS === 'true'
if (shouldUploadOrders) {
  const orderUploadInterval = Number(ORDER_UPLOAD_INTERVAL)
  logger.info('Processing orders upload job at interval: ', orderUploadInterval)
  if (!(orderUploadInterval > 0)) throw new Error('ORDER_UPLOAD_INTERVAL must be a positive number')
  const handleTraceCreateAndUploadCsvsJob = tracer.wrap('create.upload.csv.orders', createAndUploadCsvsJob)
  handleTraceCreateAndUploadCsvsJob(orderUploadInterval)
}

const shouldSendOrderUpdates = process.env.SHOULD_SEND_ORDER_UPDATES === 'true'
if (shouldSendOrderUpdates) {
  const orderUpdateInterval = Number(ORDER_UPDATE_INTERVAL)
  logger.info('Processing orders update job at interval: ', orderUpdateInterval)
  if (!(orderUpdateInterval > 0)) throw new Error('ORDER_UPDATE_INTERVAL must be a positive number')
  const handleTraceSendOrderUpdatesJob = tracer.wrap('order.updates.to.jesta', sendOrderUpdatesJob)
  handleTraceSendOrderUpdatesJob(orderUpdateInterval)
}

const shouldSendNotifications = process.env.SHOULD_SEND_NOTIFICATIONS === 'true'
if (shouldSendNotifications) {
  const sendNotificationsInterval = Number(SEND_NOTIFICATIONS_INTERVAL)
  logger.info('Processing notifications job at interval: ', sendNotificationsInterval)
  if (!(sendNotificationsInterval > 0)) throw new Error('SEND_NOTIFICATIONS_INTERVAL must be a positive number')
  const handleTraceSendOrderEmailNotificationJob = tracer.wrap('email.notifications.to.narvar', sendOrderEmailNotificationJob)
  handleTraceSendOrderEmailNotificationJob(sendNotificationsInterval)
}

const shouldCheckForStuckOrders = process.env.SHOULD_CHECK_FOR_STUCK_ORDERS === 'true'
if (shouldCheckForStuckOrders) {
  const stuckOrderCheckInterval = Number(STUCK_ORDER_CHECK_INTERVAL)
  logger.info('Processing stuck order check job at interval: ', stuckOrderCheckInterval)
  if (!(stuckOrderCheckInterval > 0)) throw new Error('STUCK_ORDER_CHECK_INTERVAL must be a positive number')
  const handleTraceCheckForStuckOrdersJob = tracer.wrap('stuck.orders.check', checkForStuckOrdersJob)
  handleTraceCheckForStuckOrdersJob(stuckOrderCheckInterval)
}

const shouldSendAlgoliaInfo = process.env.SHOULD_SEND_ALGOLIA_INFO === 'true'
if (shouldSendAlgoliaInfo) {
  const sendAlgoliaInfoInterval = Number(SEND_ALGOLIA_INFO_INTERVAL)
  logger.info('Processing Algolia job at interval: ', sendAlgoliaInfoInterval)
  if (!(sendAlgoliaInfoInterval > 0)) throw new Error('SEND_ALGOLIA_INFO_INTERVAL must be a positive number')
  const handleTraceSendConversionsToAlgoliaJob = tracer.wrap('send.conversions.to.algolia', sendConversionsToAlgoliaJob)
  handleTraceSendConversionsToAlgoliaJob(sendAlgoliaInfoInterval)
}

const shouldSendDynamicYieldInfo = process.env.SHOULD_SEND_DYNAMIC_YIELD_INFO === 'true'
if (shouldSendDynamicYieldInfo) {
  const sendDynamicYieldInfoInterval = Number(SEND_DYNAMIC_YIELD_INFO_INTERVAL)
  logger.info('Processing Dynamic Yield job at interval: ', sendDynamicYieldInfoInterval)
  if (!(sendDynamicYieldInfoInterval > 0)) throw new Error('SEND_DYNAMIC_YIELD_INFO_INTERVAL must be a positive number')
  const handleTraceSendPurchaseEventsToDynamicYieldJob = tracer.wrap('send.purchase.events.to.dynamicyield', sendPurchaseEventsToDynamicYieldJob)
  handleTraceSendPurchaseEventsToDynamicYieldJob(sendDynamicYieldInfoInterval)
}

const shouldSendOrderNarvar = process.env.SHOULD_SEND_NARVAR_ORDERS === 'true'
if (shouldSendOrderNarvar) {
  const sendToNarvarInterval = Number(SEND_NARVAR_ORDERS_INTERVAL)
  logger.info('Processing Narvar job at interval: ', sendToNarvarInterval)
  if (!(sendToNarvarInterval > 0)) throw Error('SEND_NARVAR_ORDERS_INTERVAL must be a positive number')
  const handleTraceSendOrdersToNarvarJob = tracer.wrap('send.order.to.narvar', sendOrdersToNarvarJob)
  handleTraceSendOrdersToNarvarJob(sendToNarvarInterval)
}

const shouldSendCjConversions = process.env.SHOULD_SEND_CJ_CONVERSIONS === 'true'
if (shouldSendCjConversions) {
  const sendCjConversionsInterval = Number(SEND_CJ_CONVERSIONS_INTERVAL)
  logger.info('Processing CJ job at interval: ', sendCjConversionsInterval)
  if (!(sendCjConversionsInterval > 0)) throw new Error('SEND_CJ_CONVERSIONS_INTERVAL must be a positive number')
  const handleTraceStartCjConversionJob = tracer.wrap('send.conversions.to.cj', startCjConversionJob)
  handleTraceStartCjConversionJob(sendCjConversionsInterval)
}

const shouldSendOrderSegment = process.env.SHOULD_SEND_SEGMENT_ORDERS === 'true'
if (shouldSendOrderSegment) {
  const sendToSegmentInterval = Number(SEND_SEGMENT_ORDERS_INTERVAL)
  logger.info('Processing Segment job at interval: ', sendToSegmentInterval)
  if (!(sendToSegmentInterval > 0)) throw Error('SEND_SEGMENT_ORDERS_INTERVAL must be a positive number')
  const handleTraceSendOrdersToSegmentJob = tracer.wrap('send.orders.to.segment', sendOrdersToSegmentJob)
  handleTraceSendOrdersToSegmentJob(sendToSegmentInterval)
}

type JobTime = {
  createAndUploadCsvsJob?: Date;
  sendOrderEmailNotificationJob?: Date;
  checkForStuckOrdersJob?: Date;
  sendOrderUpdatesJob?: Date;
}

module.exports = {
  getEnabledJobsLastExecutionTime: () => {
    const lastEnabledJobsRunTime: JobTime = {}
    if (shouldUploadOrders) lastEnabledJobsRunTime.createAndUploadCsvsJob = lastJobsRunTime.createAndUploadCsvsJob
    if (shouldSendNotifications) lastEnabledJobsRunTime.sendOrderEmailNotificationJob = lastJobsRunTime.sendOrderEmailNotificationJob
    if (shouldCheckForStuckOrders) lastEnabledJobsRunTime.checkForStuckOrdersJob = lastJobsRunTime.checkForStuckOrdersJob
    if (shouldSendOrderUpdates) lastEnabledJobsRunTime.sendOrderUpdatesJob = lastJobsRunTime.sendOrderUpdatesJob
    return lastEnabledJobsRunTime
  },
  jobTotalTimeout
}
