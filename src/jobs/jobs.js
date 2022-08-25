
require('dotenv').config()

const { ORDER_UPDATE_INTERVAL, ORDER_UPLOAD_INTERVAL, SEND_NOTIFICATIONS_INTERVAL, STUCK_ORDER_CHECK_INTERVAL, SEND_ALGOLIA_INFO_INTERVAL, SEND_CJ_CONVERSIONS_INTERVAL, SEND_DYNAMIC_YIELD_INFO_INTERVAL, SEND_NARVAR_ORDERS_INTERVAL } = (/** @type {import('../orders').Env} */ (process.env))
const { createAndUploadCsvs, sendConversionsToAlgolia, sendPurchaseEventsToDynamicYield, sendOrdersToNarvar, sendOrderUpdates, sleep, retry, startCjConversionJob } = require('./jobs.utils')
const {
  fetchOrderIdsThatShouldBeSentToCrm,
  setOrderSentToCrmStatus,
  fetchStuckOrderResults,
  setOrderPrimaryemail
} = require('../commercetools/commercetools')
const { sendOrderEmailNotificationByOrderId } = require('../emails/email')
const { MAXIMUM_RETRIES, JOB_TASK_TIMEOUT } = require('../constants')
const {getLoginRadiusIdforEmail,getIdentityforLRUUID} = require('../commercetools/LoginRadiusRepository.js')

const timeoutSymbol = Symbol('timeout')

const jobTotalTimeout = (MAXIMUM_RETRIES + 1) * JOB_TASK_TIMEOUT
console.log(`Jobs total timeout set to: ${jobTotalTimeout}ms`)

const lastJobsRunTime = {
  createAndUploadCsvsJob: new Date(),
  sendOrderEmailNotificationJob: new Date(),
  checkForStuckOrdersJob: new Date(),
  sendOrderUpdatesJob: new Date()
}

/**
 * @param {number} orderUploadInterval interval between each job in ms
 */
async function createAndUploadCsvsJob(orderUploadInterval) {
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
      console.error('Failed to create and uploads CSVs: ', error)
    }
    console.timeEnd('Create and uploads CSVs')
    await sleep(orderUploadInterval)
    lastJobsRunTime.createAndUploadCsvsJob = new Date()
  }
}

/**
 * @param {number} orderUploadInterval interval between each job in ms
 */
async function sendOrderUpdatesJob(orderUploadInterval) {
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
      console.error('Failed to send order updates to OMS: ', error)
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
  await Promise.all(orderIds.map(async orderId => {
    try {
      await sendOrderEmailNotificationByOrderId(orderId)
      // we retry in case the version of the order has changed by CSV job
      await retry(setOrderSentToCrmStatus)(orderId, true)
    } catch (error) {
      console.error(`Failed to send notification for order ID: ${orderId}: `, error)
      // we retry in case the version of the order has changed by CSV job
      await retry(setOrderSentToCrmStatus)(orderId, false)
    }
  }))
}

/**
 * @param {*} sendNotificationsInterval interval between each job in ms
 */
async function sendOrderEmailNotificationJob(sendNotificationsInterval) {
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
      console.error('Failed to send orders to CRM: ', error)
    }
    await sleep(sendNotificationsInterval)
    lastJobsRunTime.sendOrderEmailNotificationJob = new Date()
  }
}

/**
 * @param {*} stuckOrderCheckInterval interval between each job in ms
 */
async function checkForStuckOrdersJob(stuckOrderCheckInterval) {
  //eslint-disable-next-line no-constant-condition
  while (true) {
    const { results: stuckOrders, total: stuckOrderCount } = await fetchStuckOrderResults()

    if (stuckOrderCount > 0) {
      const stringifiedStuckOrderNumbersAndIds = stuckOrders.map(order => (JSON.stringify({ orderNumber: order.orderNumber, id: order.id })))
      console.warn(`Found stuck orders (total: ${stuckOrderCount}): [${stringifiedStuckOrderNumbersAndIds.join(', ')}]`)

      stuckOrders.forEach(async order => {
        try{const lrid = await getLoginRadiusIdforEmail(order.customerEmail)
          const primaryMail = await getIdentityforLRUUID(lrid)
          if (primaryMail !== order.customerEmail) {
            setOrderPrimaryemail(order.id, primaryMail)
          }} catch(error ){
          console.log(' error while processing the stuck ordr '+order.id +'with error :'+ error);
        }
      })

    } else {
      console.log('No stuck orders')
    }
    lastJobsRunTime.checkForStuckOrdersJob = new Date()
    await sleep(stuckOrderCheckInterval)
  }
}

/**
 * @param {number} sendToAlgoliaInterval
 */
async function sendConversionsToAlgoliaJob(sendToAlgoliaInterval) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await sendConversionsToAlgolia()
    }
    catch (error) {
      console.error('Unable to send conversions to Algolia:', error)
    }
    await sleep(sendToAlgoliaInterval)
  }
}

/**
 * @param {number} sendToDynamicYieldInterval
 */
async function sendPurchaseEventsToDynamicYieldJob(sendToDynamicYieldInterval) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await sendPurchaseEventsToDynamicYield()
    }
    catch (error) {
      console.error('Unable to send purchase events to Dynamic Yield:', error)
    }
    await sleep(sendToDynamicYieldInterval)
  }
}

/**
 * @param {number} sendToNarvarInterval
 */
async function sendOrdersToNarvarJob(sendToNarvarInterval) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      await sendOrdersToNarvar()
    }
    catch (error) {
      console.error('Unable to send orders to Narvar:', error)
    }
    await sleep(sendToNarvarInterval)
  }
}

const shouldUploadOrders = process.env.SHOULD_UPLOAD_ORDERS === 'true'
if (shouldUploadOrders) {
  const orderUploadInterval = Number(ORDER_UPLOAD_INTERVAL)
  console.log('Processing orders upload job at interval: ', orderUploadInterval)
  if (!(orderUploadInterval > 0)) throw new Error('ORDER_UPLOAD_INTERVAL must be a positive number')
  createAndUploadCsvsJob(orderUploadInterval)
}

const shouldSendOrderUpdates = process.env.SHOULD_SEND_ORDER_UPDATES === 'true'
if (shouldSendOrderUpdates) {
  const orderUpdateInterval = Number(ORDER_UPDATE_INTERVAL)
  console.log('Processing orders update job at interval: ', orderUpdateInterval)
  if (!(orderUpdateInterval > 0)) throw new Error('ORDER_UPDATE_INTERVAL must be a positive number')
  sendOrderUpdatesJob(orderUpdateInterval)
}

const shouldSendNotifications = process.env.SHOULD_SEND_NOTIFICATIONS === 'true'
if (shouldSendNotifications) {
  const sendNotificationsInterval = Number(SEND_NOTIFICATIONS_INTERVAL)
  console.log('Processing notifications job at interval: ', sendNotificationsInterval)
  if (!(sendNotificationsInterval > 0)) throw new Error('SEND_NOTIFICATIONS_INTERVAL must be a positive number')
  sendOrderEmailNotificationJob(sendNotificationsInterval)
}

const shouldCheckForStuckOrders = process.env.SHOULD_CHECK_FOR_STUCK_ORDERS === 'true'
if (shouldCheckForStuckOrders) {
  const stuckOrderCheckInterval = Number(STUCK_ORDER_CHECK_INTERVAL)
  console.log('Processing stuck order check job at interval: ', stuckOrderCheckInterval)
  if (!(stuckOrderCheckInterval > 0)) throw new Error('STUCK_ORDER_CHECK_INTERVAL must be a positive number')
  checkForStuckOrdersJob(stuckOrderCheckInterval)
}

const shouldSendAlgoliaInfo = process.env.SHOULD_SEND_ALGOLIA_INFO === 'true'
if (shouldSendAlgoliaInfo) {
  const sendAlgoliaInfoInterval = Number(SEND_ALGOLIA_INFO_INTERVAL)
  console.log('Processing Algolia job at interval: ', sendAlgoliaInfoInterval)
  if (!(sendAlgoliaInfoInterval > 0)) throw new Error('SEND_ALGOLIA_INFO_INTERVAL must be a positive number')
  sendConversionsToAlgoliaJob(sendAlgoliaInfoInterval)
}

const shouldSendDynamicYieldInfo = process.env.SHOULD_SEND_DYNAMIC_YIELD_INFO === 'true'
if (shouldSendDynamicYieldInfo) {
  const sendDynamicYieldInfoInterval = Number(SEND_DYNAMIC_YIELD_INFO_INTERVAL)
  console.log('Processing Dynamic Yield job at interval: ', sendDynamicYieldInfoInterval)
  if (!(sendDynamicYieldInfoInterval > 0)) throw new Error('SEND_DYNAMIC_YIELD_INFO_INTERVAL must be a positive number')
  sendPurchaseEventsToDynamicYieldJob(sendDynamicYieldInfoInterval)
}

const shouldSendOrderNarvar = process.env.SHOULD_SEND_NARVAR_ORDERS === 'true'
if (shouldSendOrderNarvar) {
  const sendToNarvarInterval = Number(SEND_NARVAR_ORDERS_INTERVAL)
  console.log('Processing Narvar job at interval: ', sendToNarvarInterval)
  if (!(sendToNarvarInterval > 0)) throw Error('SEND_NARVAR_ORDERS_INTERVAL must be a positive number')
  sendOrdersToNarvarJob(sendToNarvarInterval)
}

const shouldSendCjConversions = process.env.SHOULD_SEND_CJ_CONVERSIONS === 'true'
if (shouldSendCjConversions) {
  const sendCjConversionsInterval = Number(SEND_CJ_CONVERSIONS_INTERVAL)
  console.log('Processing CJ job at interval: ', sendCjConversionsInterval)
  if (!(sendCjConversionsInterval > 0)) throw new Error('SEND_CJ_CONVERSIONS_INTERVAL must be a positive number')
  startCjConversionJob(sendCjConversionsInterval)
}

module.exports = {
  getEnabledJobsLastExecutionTime: () => {
    const lastEnabledJobsRunTime = {}
    if (shouldUploadOrders) lastEnabledJobsRunTime.createAndUploadCsvsJob = lastJobsRunTime.createAndUploadCsvsJob
    if (shouldSendNotifications) lastEnabledJobsRunTime.sendOrderEmailNotificationJob = lastJobsRunTime.sendOrderEmailNotificationJob
    if (shouldCheckForStuckOrders) lastEnabledJobsRunTime.checkForStuckOrdersJob = lastJobsRunTime.checkForStuckOrdersJob
    if (shouldSendOrderUpdates) lastEnabledJobsRunTime.sendOrderUpdatesJob = lastJobsRunTime.sendOrderUpdatesJob
    return lastEnabledJobsRunTime
  },
  jobTotalTimeout
}
