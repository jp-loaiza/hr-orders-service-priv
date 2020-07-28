const fetch = require('node-fetch').default
const { fetchFullOrder } = require('./commercetools')
const { EMAIL_API_OWNER_ID } = require('./constants')

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
    throw new Error(`Unable to send email notification for order ${orderId} because order could not be fetched from commercetools: ${err.message}`)
  }

  const body = JSON.stringify(formatEmailApiRequestBodyFromOrder(order))
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(EMAIL_API_USERNAME + ':' + EMAIL_API_PASSWORD).toString('base64')}`
  }

  const response = await fetch(EMAIL_API_URL, { method: 'POST', body, headers })
  if (response.status === 200) return true
  throw new Error(`Unable to send email notification for order ${orderId} because email API service responded with status ${response.status}: ${response}`)
}

module.exports = {
  formatEmailApiRequestBodyFromOrder,
  sendOrderEmailNotificationByOrderId
}
