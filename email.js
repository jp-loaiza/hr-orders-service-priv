const fetch = require('node-fetch').default
const AbortController = require('abort-controller')
const { fetchFullOrder } = require('./commercetools')
const { EMAIL_API_OWNER_ID, FETCH_ABORT_TIMEOUT } = require('./constants')

const { EMAIL_API_USERNAME,
  EMAIL_API_URL,
  EMAIL_API_PASSWORD } = (/** @type {import('./orders').Env} */ (process.env))

/**
 * @param {import('./orders').Order} order 
 */
const formatEmailApiRequestBodyFromOrder = order => ({
  request: {
    OwnerId: EMAIL_API_OWNER_ID,
    Channel: 'Email',
    Subject: JSON.stringify({ Name: 'Salesorder', Id: order.orderNumber }),
    Topic: 'Confirmation',
    Recipient: JSON.stringify({
      address: order.customerEmail,
      locale: order.locale
    }),
    // Required even though it's blank. From CRM's documentation: "Not
    // currently implemented - This parameter will eventually be used to
    // override the sender for the communication"
    Sender: '',
    Data: JSON.stringify(order)
  }
})

/**
 * @param {string} orderId
 */
const sendOrderEmailNotificationByOrderId = async orderId => {
  let order
  try {
    order = await fetchFullOrder(orderId)
  } catch (err) {
    throw new Error(`Order could not be fetched from commercetools: ${err.message}`)
  }

  // @ts-ignore
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, FETCH_ABORT_TIMEOUT)

  const response = await fetch(EMAIL_API_URL, {
    body: JSON.stringify(formatEmailApiRequestBodyFromOrder(order)),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(EMAIL_API_USERNAME + ':' + EMAIL_API_PASSWORD).toString('base64')}`
    }, 
    method: 'POST',
    signal: controller.signal
  })
    .catch(error => {
      if (error.name === 'AbortError') {
        console.log('Send order email notification request was aborted.')
      }
      throw error
    })
    .finally(() => { clearTimeout(timeout) })
  if (response.status === 200) return true
  const error = new Error(`Email API service responded with status ${response.status}: ${response}.`)
  console.error(error)
  console.error(response)
  throw error
}

module.exports = {
  formatEmailApiRequestBodyFromOrder,
  sendOrderEmailNotificationByOrderId
}
