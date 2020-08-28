
require('dotenv').config()

const { ORDER_UPLOAD_INTERVAL, SEND_NOTIFICATIONS_INTERVAL } = (/** @type {import('./orders').Env} */ (process.env))
const { createAndUploadCsvs, sleep, retry } = require('./jobs.utils')
const { fetchOrderIdsThatShouldBeSentToCrm, setOrderSentToCrmStatus } = require('./commercetools')
const { sendOrderEmailNotificationByOrderId } = require('./email')
const { MAXIMUM_RETRIES, JOB_TASK_TIMEOUT } = require('./constants')

const timeoutSymbol = Symbol('timeout')

const jobTotalTimeout = (MAXIMUM_RETRIES + 1) *  JOB_TASK_TIMEOUT
console.log(`Jobs total timeout set to: ${jobTotalTimeout}ms`)

const lastJobsRunTime = {
  createAndUploadCsvsJob: new Date(),
  sendOrderEmailNotificationJob: new Date()
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
    lastJobsRunTime.createAndUploadCsvsJob = new Date()
  }
}

if (process.env.SHOULD_UPLOAD_ORDERS === 'true') {
  const orderUploadInterval = Number(ORDER_UPLOAD_INTERVAL)
  console.log('Processing orders upload job at interval: ', orderUploadInterval)
  if (!(orderUploadInterval > 0)) throw new Error('ORDER_UPLOAD_INTERVAL must be a positive number')
  createAndUploadCsvsJob(orderUploadInterval)
}

if (process.env.SHOULD_SEND_NOTIFICATIONS === 'true') {
  const sendNotificationsInterval = Number(SEND_NOTIFICATIONS_INTERVAL)
  console.log('Processing notifications job at interval: ', sendNotificationsInterval)
  if (!(sendNotificationsInterval > 0)) throw new Error('SEND_NOTIFICATIONS_INTERVAL must be a positive number')
  sendOrderEmailNotificationJob(sendNotificationsInterval)
}

module.exports = {
  getJobsLastExecutionTime: () => lastJobsRunTime,
  jobTotalTimeout
}