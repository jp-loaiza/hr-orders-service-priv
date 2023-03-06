import { fetchFullOrder } from '../commercetools/commercetools'
import { EMAIL_API_OWNER_ID } from '../constants'
import { default as logger, serializeError } from '../logger'
import { fetchWithTimeout } from '../request.utils.js'
import { Order } from "../orders"
import {
  EMAIL_API_URL,
  EMAIL_API_USERNAME,
  EMAIL_API_PASSWORD
} from '../config'

/**
 * @param {import('@commercetools/platform-sdk').Order} order 
 */
export const formatEmailApiRequestBodyFromOrder = (order: Order) => {
  let Topic = order.custom?.fields.isStorePickup ? 'ConfirmationBOPIS' : 'Confirmation'
  if (order.custom?.fields.cartSourceWebsite === '00997') {
    Topic = 'ConfirmationFinalCut'
  }
  return ({
    request: {
      OwnerId: EMAIL_API_OWNER_ID,
      Channel: 'Email',
      Subject: JSON.stringify({ Name: 'Salesorder', Id: order.orderNumber }),
      Topic,
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
}

/**
 * @param {string} orderId
 */
export const sendOrderEmailNotificationByOrderId = async (orderId: string) => {
  let order
  try {
    order = await fetchFullOrder(orderId)
  } catch (err) {
    throw new Error(`Order could not be fetched from commercetools: ${err.message}`)
  }

  try {
    await sendOrderEmailNotificationByOrder(order)
  } catch (err) {
    logger.error({
      type: 'email_notify',
      message: `failed to send email for orderID: ${order.id}, orderNumber: ${order.orderNumber}`,
      error: serializeError(err)
    })
  }

}

export async function sendOrderEmailNotificationByOrder(order: Order) {
  try {
    if (EMAIL_API_URL) {
      await fetchWithTimeout(EMAIL_API_URL, {
        body: JSON.stringify(formatEmailApiRequestBodyFromOrder(order)),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(EMAIL_API_USERNAME + ':' + EMAIL_API_PASSWORD).toString('base64')}`
        },
        method: 'POST',
      })
    }
  } catch (error) {
    logger.error({
      type: 'email_notify',
      message: `failed to send email for orderID: ${order.id}, orderNumber: ${order.orderNumber}`,
      error: serializeError(error)
    })
  }

}

