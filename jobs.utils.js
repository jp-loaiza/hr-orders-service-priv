const client = require('ssh2-sftp-client')

const { validateOrder } = require('./validation')
const { 
  MAXIMUM_RETRIES,
  ORDER_CUSTOM_FIELDS,
  PAYMENT_STATES, 
  TRANSACTION_TYPES, 
  TRANSACTION_STATES, 
  JESTA_ORDER_STATUSES, 
  SENT_TO_ALGOLIA_STATUSES, 
  SENT_TO_CJ_STATUSES, 
  SENT_TO_DYNAMIC_YIELD_STATUSES, 
  SENT_TO_NARVAR_STATUSES 
} = require('./constants')
const {
  fetchOrdersThatShouldBeSentToOms,
  setOrderAsSentToOms,
  setOrderCustomField,
  setOrderErrorFields,
  fetchOrdersThatShouldBeUpdatedInOMS,
  fetchOrdersWhoseTrackingDataShouldBeSentToAlgolia,
  fetchOrdersWhoseConversionsShouldBeSentToCj,
  fetchOrdersWhosePurchasesShouldBeSentToDynamicYield,
  fetchOrdersThatShouldBeSentToNarvar,
  fetchStates,
  fetchShipments
} = require('./commercetools')
const { sendOrderUpdateToJesta } = require('./jesta')
const { generateCsvStringFromOrder } = require('./csv')
const { sftpConfig } = require('./config')
const { SFTP_INCOMING_ORDERS_PATH } = (/** @type {import('./orders').Env} */ (process.env))
const { sendManyConversionsToAlgolia, getConversionsFromOrder } = require('./algolia')
const { getDYReportEventFromOrder, sendPurchaseEventToDynamicYield } = require('./dynamicYield')
const { sendOrderConversionToCj } = require('./cj')
const { convertOrderForNarvar, sendToNarvar } = require('./narvar')

/**
 *
 * @param {number} ms time to sleep in ms
 */
async function sleep(ms) {
  return new Promise(function(resolve) {
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
function retry (fn, maxRetries = MAXIMUM_RETRIES, backoff = 1000) {
  return ( /** @param {any[]} args */ async function (...args){
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
 * @param {Array<import('./orders').Transaction>} transactions
 * @param {string} type
 * @param {string} state
 */
const getTransaction = (transactions, type, state) => transactions.find(transaction => transaction.type === type && transaction.state === state)

/**
 *
 * @param {import('./orders').Order} order
 */
const transformToOrderPayment = order => {
  const orderUpdate = {
    orderNumber: order.orderNumber
  }

  const creditPaymentInfo = order.paymentInfo.payments.find(payment => payment.obj.paymentMethodInfo.method === 'credit')
  if (!creditPaymentInfo) {
    orderUpdate.errorMessage = 'No credit card payment with payment release change'
    console.error(`Failed to find credit payment info for order ${order.orderNumber}: `, JSON.stringify(order.paymentInfo, null, 3))
    return orderUpdate
  }

  const interfaceCode = creditPaymentInfo.obj.paymentStatus.interfaceCode
  let transaction = null
  if (interfaceCode === PAYMENT_STATES.PREAUTHED) { // delayed capture is ON and DM accepted
    transaction = getTransaction(creditPaymentInfo.obj.transactions, TRANSACTION_TYPES.AUTHORIZATION, TRANSACTION_STATES.SUCCESS)
  } else if (interfaceCode === PAYMENT_STATES.CANCELLED) { // delated capture is ON or OFF but DM rejected
    transaction = getTransaction(creditPaymentInfo.obj.transactions, TRANSACTION_TYPES.AUTHORIZATION, TRANSACTION_STATES.FAILURE)
                  || getTransaction(creditPaymentInfo.obj.transactions, TRANSACTION_TYPES.CHARGE, TRANSACTION_STATES.FAILURE)
  } else if (interfaceCode === PAYMENT_STATES.PAID) { // delayed capture is OFF and DM accepted
    transaction = getTransaction(creditPaymentInfo.obj.transactions, TRANSACTION_TYPES.CHARGE, TRANSACTION_STATES.SUCCESS)
  }

  if (!transaction) {
    orderUpdate.errorMessage = `Order update is not for a status that jesta recognizes: ${interfaceCode}`
    console.error(`Failed to set transaction for order ${order.orderNumber}: `, JSON.stringify(creditPaymentInfo.obj.transactions, null, 3))
    return orderUpdate
  }

  return { ...orderUpdate, status: transaction.state }
}

/**
 *
 * @param {import('./orders').Order} order
 * @explain JESTA expects CSV filenames to be of the form `Orders-YYYY-MM-DD-HHMMSS<orderNumber>.csv`.
 */
const generateFilenameFromOrder = order => {
  const orderDate = new Date(order.createdAt)
  const dateString = order.createdAt.slice(0, 10)
  const timeString = [orderDate.getUTCHours(), orderDate.getUTCMinutes(), orderDate.getUTCSeconds()]
    .map(timeComponent => timeComponent.toString().padStart(2, '0'))
    .join('')

  return `Orders-${dateString}-${timeString}${order.orderNumber}.csv`
}

const createAndUploadCsvs = async () => {
  let sftp
  try {
    sftp = new client()
    await sftp.connect(sftpConfig)
    console.log('Connected to SFTP server')

    const { orders, total } = await fetchOrdersThatShouldBeSentToOms()
    console.log(`Starting to process ${orders.length} orders (total in backlog: ${total})`)

    for (const order of orders) {
      let csvString
      try {
        if (!validateOrder(order)) throw new Error('Invalid order')
        csvString = generateCsvStringFromOrder(order)
      } catch (err) {
        const errorMessage = err.message === 'Invalid order' ? JSON.stringify(validateOrder.errors) : 'Unable to generate CSV'
        console.error(`Unable to generate CSV for order ${order.orderNumber}: `, errorMessage)
        console.error(err)
        // we retry in case the version of the order has changed by the notifications job
        await retry(setOrderErrorFields)(order, errorMessage, true, {
          retryCountField: ORDER_CUSTOM_FIELDS.RETRY_COUNT,
          nextRetryAtField: ORDER_CUSTOM_FIELDS.NEXT_RETRY_AT,
          statusField: ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS
        })
        continue
      }
      try {
        console.log(`Attempting to upload CSV to JESTA for order ${order.orderNumber}`)
        await sftp.put(Buffer.from(csvString), SFTP_INCOMING_ORDERS_PATH + generateFilenameFromOrder(order))
        console.log(`Successfully uploaded CSV to JESTA for order ${order.orderNumber}`)
      } catch (err) {
        console.error(`Unable to upload CSV to JESTA for order ${order.orderNumber}`)
        await retry(setOrderErrorFields)(order, 'Unable to upload CSV to JESTA', true, {
          retryCountField: ORDER_CUSTOM_FIELDS.RETRY_COUNT,
          nextRetryAtField: ORDER_CUSTOM_FIELDS.NEXT_RETRY_AT,
          statusField: ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS
        })
        continue
      }
      // we retry in case the version of the order has changed by the notifications job
      await retry(setOrderAsSentToOms)(order, ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS)
    }
    console.log('Done processing orders')
  } catch (err) {
    console.error('Unable to process orders:')
    console.error(err)
  } finally {
    if (sftp) {
      await sftp.end()
        .catch(function (err) {
          console.error('Unable to close SFTP connection: ', err)
        })
    }
  }
}

async function sendOrderUpdates () {
  const { orders: ordersToUpdate, total } = await fetchOrdersThatShouldBeUpdatedInOMS()
  if (ordersToUpdate.length) {
    console.log(`Sending ${ordersToUpdate.length} order updates to OMS (total in backlog: ${total}): ${JSON.stringify(ordersToUpdate)}`)
  }
  await Promise.all(ordersToUpdate.map(async orderToUpdate => {
    try {
      const orderPayment = transformToOrderPayment(orderToUpdate)
      if (orderPayment.errorMessage) {
        await retry(setOrderErrorFields)(orderToUpdate, orderPayment.errorMessage, true, {
          retryCountField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_RETRY_COUNT,
          nextRetryAtField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_NEXT_RETRY_AT,
          statusField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_STATUS
        })
      } else {
        const orderStatus = orderPayment.status === TRANSACTION_STATES.SUCCESS ? JESTA_ORDER_STATUSES.RELEASED : JESTA_ORDER_STATUSES.CANCELLED
        await sendOrderUpdateToJesta(orderPayment.orderNumber, orderStatus, orderToUpdate.custom.fields.cartSourceWebsite)
        // we retry in case the version of the order has changed by CSV job
        await retry(setOrderAsSentToOms)(orderToUpdate, ORDER_CUSTOM_FIELDS.OMS_UPDATE_STATUS)
      }
    } catch (error) {
      console.error(`Failed to send order update to jesta for order number: ${orderToUpdate.orderNumber}: `, error.message)
      // we retry in case the version of the order has changed by CSV job
      await retry(setOrderErrorFields)(orderToUpdate, error.message, true, {
        retryCountField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.OMS_UPDATE_STATUS
      })
    }
  }))
}

async function sendConversionsToAlgolia() {
  const { orders, total } = await fetchOrdersWhoseTrackingDataShouldBeSentToAlgolia()
  console.log(total > 0 ? `Sending conversion data to Algolia. ${total} orders for which to send conversion data.`: 'No orders with conversion data to send to Algolia.')
  for (const order of orders) {
    try {
      const conversions = getConversionsFromOrder(order)
      await sendManyConversionsToAlgolia(conversions)
      console.log(`Sent Algolia conversion updates for order ${order.orderNumber}`)
      await retry(setOrderCustomField)(order.id, 'sentToAlgoliaStatus', SENT_TO_ALGOLIA_STATUSES.SUCCESS)
    } catch (error) {
      console.error(`Failed to send Algolia conversion updates for order ${order.orderNumber}:`, error)
      await retry(setOrderErrorFields)(order, error.message, true, {
        retryCountField: ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_STATUS
      })
    }
    await sleep(100) // prevent CT/Algolia from getting overloaded
  }
}

async function sendPurchaseEventsToDynamicYield() {
  const { orders, total } = await fetchOrdersWhosePurchasesShouldBeSentToDynamicYield()
  console.log(total > 0 ? `Sending purchase data to Dynamic Yield. ${total} orders for which to send purchase data.`: 'No orders with purchase data to send to Dynamic Yield.')

  for (const order of orders) {
    try {
      const dynamicYieldEventData = getDYReportEventFromOrder(order)
      await sendPurchaseEventToDynamicYield(dynamicYieldEventData)
      console.log(`Sent Dynamic Yield purchase event for order ${order.orderNumber}`)
      await retry(setOrderCustomField)(order.id, ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS, SENT_TO_DYNAMIC_YIELD_STATUSES.SUCCESS)
    } catch (error) {
      console.error(`Failed to send Dynamic Yield purchase event for order ${order.orderNumber}:`, error)
      await retry(setOrderErrorFields)(order, error.message, true, {
        retryCountField: ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS
      })
    }
    await sleep(100) // prevent CT/Dynamic Yield from getting overloaded
  }
}

async function sendOrdersToNarvar() {
  const states = await fetchStates()
  const { orders, total } = await fetchOrdersThatShouldBeSentToNarvar()
  console.log(`Fetched ${orders.length} orders to be sent to Narvar, total= ${total}`)

  for (const order of orders) {
    try {
      const shipments = await fetchShipments(order.orderNumber)
      const narvarOrder = convertOrderForNarvar(order, shipments, states)
      if(narvarOrder) {
        await sendToNarvar(narvarOrder)
        await retry(setOrderCustomField)(order.id, ORDER_CUSTOM_FIELDS.NARVAR_STATUS, SENT_TO_NARVAR_STATUSES.SUCCESS)
        await retry(setOrderCustomField)(order.id, ORDER_CUSTOM_FIELDS.NARVAR_LAST_SUCCESS_TIME, new Date())
      }
    } catch (error) {
      console.error(`Failed to send order ${order.orderNumber}: to Narvar`, error)
      await retry(setOrderErrorFields)(order, error.message, true, {
        retryCountField: ORDER_CUSTOM_FIELDS.NARVAR_RETRY_COUNT,
        nextRetryAtField: ORDER_CUSTOM_FIELDS.NARVAR_NEXT_RETRY_AT,
        statusField: ORDER_CUSTOM_FIELDS.NARVAR_STATUS
      })
    }
    await sleep(100) // prevent CT/Narvar from getting overloaded
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
}) {
  async function processOrders() {
    const { orders, total } = await fetchRelevantOrders()
    console.log(total > 0 ? `Processing orders for ${name} job (total in backlog: ${total}).`: `No orders for ${name} job to process.`)
    for (const order of orders) {
      try {
        await processOrder(order)
        await retry(setOrderCustomField)(order.id, statusField, statuses.SUCCESS)
        console.log(`${name} job successfully processed order ${order.orderNumber}`)
      } catch (error) {
        console.error(`${name} job failed to process order ${order.orderNumber}: ${error.message || JSON.stringify(error)}`)
        await retry(setOrderErrorFields)(order, error.message || JSON.stringify(error), true, { retryCountField, nextRetryAtField, statusField })
      }
    }
  }

  return async function startJob(/** @type {number} **/ interval) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await processOrders()
      } catch (error) {
        console.error(`Unexpected ${name} job error: ${error.message || JSON.stringify(error)}`)
      }
      await sleep(interval)
    }
  }
}

const startCjConversionJob = createJob({
  name: 'CJ conversions',
  fetchRelevantOrders: fetchOrdersWhoseConversionsShouldBeSentToCj,
  processOrder: sendOrderConversionToCj,
  retryCountField: ORDER_CUSTOM_FIELDS.CJ_CONVERSION_RETRY_COUNT,
  nextRetryAtField: ORDER_CUSTOM_FIELDS.CJ_CONVERSION_NEXT_RETRY_AT,
  statusField: ORDER_CUSTOM_FIELDS.CJ_CONVERSION_STATUS,
  statuses: SENT_TO_CJ_STATUSES
})

module.exports = {
  sleep,
  retry,
  createAndUploadCsvs,
  generateFilenameFromOrder,
  sendOrderUpdates,
  sendConversionsToAlgolia,
  sendPurchaseEventsToDynamicYield,
  sendOrdersToNarvar,
  startCjConversionJob,
  transformToOrderPayment
}
