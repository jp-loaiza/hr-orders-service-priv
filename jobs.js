
require('dotenv').config()

const { ORDER_UPLOAD_INTERVAL, SEND_NOTIFICATIONS_INTERVAL } = (/** @type {import('./orders').Env} */ (process.env))
const { createAndUploadCsvs, sleep, retry } = require('./jobs.utils')
const { fetchOrderIdsThatShouldBeSentToCrm, setOrderSentToCrmStatus } = require('./commercetools')
const { sendOrderEmailNotificationByOrderId } = require('./email')

/**
 * @param {number} orderUploadInterval interval between each job in ms
 */
async function createAndUploadCsvsJob (orderUploadInterval) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.time('Create and uploads CSVs')
    try {
      await createAndUploadCsvs()
    } catch (error) {
      console.error('Failed to create and uploads CSVs: ', error)
    }
    console.timeEnd('Create and uploads CSVs')
    await sleep(orderUploadInterval)
  }
}

/**
 * @param {*} sendNotificationsInterval interval between each job in ms
 */
async function sendOrderEmailNotificationJob (sendNotificationsInterval) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
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
    } catch (error) {
      console.error('Failed to send orders to CRM: ', error)
    }
    await sleep(sendNotificationsInterval)
  }
}

if (process.env.SHOULD_RUN_JOBS === 'true') {
  const orderUploadInterval = Number(ORDER_UPLOAD_INTERVAL)
  if (!(orderUploadInterval > 0)) throw new Error('ORDER_UPLOAD_INTERVAL must be a positive number')
  createAndUploadCsvsJob(orderUploadInterval)

  const sendNotificationsInterval = Number(SEND_NOTIFICATIONS_INTERVAL)
  if (!(sendNotificationsInterval > 0)) throw new Error('SEND_NOTIFICATIONS_INTERVAL must be a positive number')
  sendOrderEmailNotificationJob(sendNotificationsInterval)
}
