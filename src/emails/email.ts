import { setOrderSentToCrmStatus } from '../commercetools/commercetools'
import { EMAIL_API_OWNER_ID } from '../constants'
import { default as logger, serializeError } from '../logger'
import { fetchWithTimeout } from '../request.utils.js'
import { Order } from "../orders"
import {
  EMAIL_API_URL,
  EMAIL_API_USERNAME,
  EMAIL_API_PASSWORD
} from '../config'
import { retry } from '../jobs/jobs.utils'
import tracer, { hydrateOrderSpanTags, spanSetError } from '../tracer'

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
export const sendOrderEmailNotification = async (order: Order) => {
  await tracer.trace('order_service_job', { resource: 'order_email_notification' }, async () => {
    hydrateOrderSpanTags(order)

    try {
      await sendOrderEmailNotificationByOrder(order)

      // we retry in case the version of the order has changed by CSV job
      await retry(setOrderSentToCrmStatus)(order.id, true)
    } catch (err) {
      spanSetError(err)
      logger.error({
        type: 'order_email_notification_failure',
        message: `Failed to send order email notification to CRM for orderID:${order.id}`,
        error: serializeError(err)
      })

      // we retry in case the version of the order has changed by CSV job
      await retry(setOrderSentToCrmStatus)(order.id, false)
    }
  })
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

