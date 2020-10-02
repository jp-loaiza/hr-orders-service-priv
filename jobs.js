
require('dotenv').config()

const { ORDER_UPLOAD_INTERVAL, SEND_NOTIFICATIONS_INTERVAL, STUCK_ORDER_CHECK_INTERVAL } = (/** @type {import('./orders').Env} */ (process.env))
const { createAndUploadCsvs, sleep, retry } = require('./jobs.utils')
const { fetchOrderIdsThatShouldBeSentToCrm, setOrderSentToCrmStatus, fetchStuckOrderResults } = require('./commercetools')
const { sendOrderEmailNotificationByOrderId } = require('./email')
const { MAXIMUM_RETRIES, JOB_TASK_TIMEOUT } = require('./constants')

const timeoutSymbol = Symbol('timeout')

const jobTotalTimeout = (MAXIMUM_RETRIES + 1) *  JOB_TASK_TIMEOUT
console.log(`Jobs total timeout set to: ${jobTotalTimeout}ms`)

const lastJobsRunTime = {
  createAndUploadCsvsJob: new Date(),
  sendOrderEmailNotificationJob: new Date(),
  checkForStuckOrdersJob: new Date()
}

/**
 * @param {number} orderUploadInterval interval between each job in ms
 */
async function createAndUploadCsvsJob (orderUploadInterval) {
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

async function sendOrderEmailNotification () {
  const orderIds = await fetchOrderIdsThatShouldBeSentToCrm()
  if (orderIds.length) {
    console.log(`Sending ${orderIds.length} orders to CRM: ${orderIds}`)
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
async function sendOrderEmailNotificationJob (sendNotificationsInterval) {
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
  // eslint-disable-next-line no-constant-condition
  while(true) {
    const { results: stuckOrders, total: stuckOrderCount } = await fetchStuckOrderResults()
    if (stuckOrderCount > 0) {
      const stringifiedStuckOrderNumbersAndIds = stuckOrders.map(order => (JSON.stringify({ orderNumber: order.orderNumber, id: order.id })))
      console.warn(`Found stuck orders (total: ${stuckOrderCount}): [${stringifiedStuckOrderNumbersAndIds.join(', ')}]`)
    } else {
      console.log('No stuck orders')
    }
    lastJobsRunTime.checkForStuckOrdersJob = new Date()
    await sleep(stuckOrderCheckInterval)
  }
}

const shouldUploadOrders = process.env.SHOULD_UPLOAD_ORDERS === 'true'
if (shouldUploadOrders) {
  const orderUploadInterval = Number(ORDER_UPLOAD_INTERVAL)
  console.log('Processing orders upload job at interval: ', orderUploadInterval)
  if (!(orderUploadInterval > 0)) throw new Error('ORDER_UPLOAD_INTERVAL must be a positive number')
  createAndUploadCsvsJob(orderUploadInterval)
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


module.exports = {
  getEnabledJobsLastExecutionTime: () => {
    const lastEnabledJobsRunTime = {}
    if (shouldUploadOrders) lastEnabledJobsRunTime.createAndUploadCsvsJob = lastJobsRunTime.createAndUploadCsvsJob
    if (shouldSendNotifications) lastEnabledJobsRunTime.sendOrderEmailNotificationJob = lastJobsRunTime.sendOrderEmailNotificationJob
    if (shouldCheckForStuckOrders) lastEnabledJobsRunTime.checkForStuckOrdersJob = lastJobsRunTime.checkForStuckOrdersJob
    return lastEnabledJobsRunTime
  },
  jobTotalTimeout
}
