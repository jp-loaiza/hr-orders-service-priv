import logger, { serializeError } from "../logger"
import tracer from '../tracer'

const {
  ORDER_UPDATE_INTERVAL,
  ORDER_UPLOAD_INTERVAL,
  SEND_NOTIFICATIONS_INTERVAL,
  STUCK_ORDER_CHECK_INTERVAL,
  FULL_GIFT_CARD_ORDER_CHECK_INTERVAL,
  SEND_ALGOLIA_INFO_INTERVAL,
  SEND_CJ_CONVERSIONS_INTERVAL,
  SEND_NARVAR_ORDERS_INTERVAL,
  SEND_SEGMENT_ORDERS_INTERVAL,
  SEND_ORDERS_STATUS_PENDING_TO_LOGS_INTERVAL,
  SEND_BOLD_ORDERS_INTERVAL } = (/** @type {import('../orders').Env} */ (process.env))
import {
  createAndUploadCsvs,
  sendConversionsToAlgolia,
  sendOrdersToNarvar,
  sendOrdersStatusPendingToLogs,
  sendOrderUpdates,
  sleep,
  startCjConversionJob,
  sendOrdersToSegment,
  jobTotalTimeout,
  lastJobsRunTime,
  sendOrdersToBold
} from './jobs.utils'
import {
  fetchOrderIdsThatShouldBeSentToCrm,
  fetchStuckOrderResults,
  fetchFullGiftCardOrderResults
} from '../commercetools/commercetools'
import {
  shouldCheckForStuckOrders,
  shouldCheckForFullGiftCardOrders,
  shouldSendAlgoliaInfo,
  shouldSendCjConversions,
  shouldSendNotifications,
  shouldSendOrderNarvar,
  shouldSendOrderSegment,
  shouldSendOrderUpdates,
  shouldSendOrdersStatusPendingToLogs,
  shouldUploadOrders,
  shouldSendOrderBold
} from "../config"
import { Order } from "../orders"
import { sendOrderEmailNotification } from "../emails/email"

const timeoutSymbol = Symbol('timeout')

logger.info(`Jobs total timeout set to: ${jobTotalTimeout}ms`)

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
        type: 'order_updates_oms',
        message: 'Failed to send order updates to OMS',
        error: serializeError(error)
      })
    }
    await sleep(orderUploadInterval)
    lastJobsRunTime.sendOrderUpdatesJob = new Date()
  }
}

export async function sendOrderEmailNotifications() {
  const { orders, total } = await fetchOrderIdsThatShouldBeSentToCrm()
  if (orders.length === 0) return

  logger.info(`Sending ${orders.length} orders to CRM (total in backlog: ${total})`)
  await tracer.trace('order_service_job_batch', { resource: 'order_email_notification_batch' }, async () => {
    await Promise.all(orders.map(async (order) => {
      await sendOrderEmailNotification(order)
    }))
  })
}

/**
 * @param {*} sendNotificationsInterval interval between each job in ms
 */
async function sendOrderEmailNotificationJob(sendNotificationsInterval: number) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const result = await Promise.race([
        sendOrderEmailNotifications(),
        sleep(jobTotalTimeout).then(() => timeoutSymbol)
      ])
      if (result === timeoutSymbol) {
        throw new Error(`Sending notification requests to OMS timedout after ${jobTotalTimeout}ms.`)
      }
    } catch (error) {
      logger.error({
        type: 'email_notification',
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

      logger.warn({
        type: 'stuck_orders',
        stuck_orders: stuckOrderCount,
        message: `Found stuck orders (total: ${stuckOrderCount}): [${stringifiedStuckOrderNumbersAndIds.join(', ')}]`
      })

    } else {
      logger.info('No stuck orders')
    }
    lastJobsRunTime.checkForStuckOrdersJob = new Date()
    await sleep(stuckOrderCheckInterval)
  }
}

async function checkForFullGiftCardOrdersJob(fullGiftCardOrderCheckInterval: number) {
  //eslint-disable-next-line no-constant-condition
  while (true) {
    const ordersPaidByFullGiftCard = await fetchFullGiftCardOrderResults()
    if (ordersPaidByFullGiftCard && ordersPaidByFullGiftCard.length > 0) {
      const stringifiedFullGiftCardOrderNumbersAndIds = ordersPaidByFullGiftCard.map((order: Order) => (JSON.stringify({ orderNumber: order.orderNumber, id: order.id })))

      logger.warn({
        type: 'fraud_order',
        full_gift_card_orders: ordersPaidByFullGiftCard.length,
        message: `Found order with only giftcard payment, (total: ${ordersPaidByFullGiftCard.length}): [${stringifiedFullGiftCardOrderNumbersAndIds.join(', ')}]`
      })

    } else {
      logger.info('No order with only gift card payment in past period')
    }
    lastJobsRunTime.checkForFullGiftCardOrdersJob = new Date()
    await sleep(fullGiftCardOrderCheckInterval)
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

async function sendOrdersToBoldJob(sendOrdersToBoldInterval: number) {
  while(true) {
    try {
      await sendOrdersToBold()
    } catch (error) {
      logger.error({
        type: 'send_to_bold_failure',
        message: 'Failed to send order fulfillment to Bold',
        error: serializeError(error)
      })
    }
    await sleep(sendOrdersToBoldInterval)
  }
}

/**
 * @param {number} SEND_ORDERS_STATUS_PENDING_TO_LOGS_INTERVAL
 */
async function sendOrdersStatusPendingToLogsJob(sendOrdersStatusPendingToLogsInterval: number) {
  while(true) {
    try {
      await sendOrdersStatusPendingToLogs()
    }catch (error) {
      logger.error({
        type: 'send_report_orders_pending_to_narvar_failure',
        error: serializeError(error)
      })
    }
    await sleep(sendOrdersStatusPendingToLogsInterval)
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

if (shouldUploadOrders) {
  const orderUploadInterval = Number(ORDER_UPLOAD_INTERVAL)
  logger.info('Processing orders upload job at interval: ', orderUploadInterval)
  if (!(orderUploadInterval > 0)) throw new Error('ORDER_UPLOAD_INTERVAL must be a positive number')
  createAndUploadCsvsJob(orderUploadInterval)
}

if (shouldSendOrderUpdates) {
  const orderUpdateInterval = Number(ORDER_UPDATE_INTERVAL)
  logger.info('Processing orders update job at interval: ', orderUpdateInterval)
  if (!(orderUpdateInterval > 0)) throw new Error('ORDER_UPDATE_INTERVAL must be a positive number')
  sendOrderUpdatesJob(orderUpdateInterval)
}

if (shouldSendNotifications) {
  const sendNotificationsInterval = Number(SEND_NOTIFICATIONS_INTERVAL)
  logger.info('Processing notifications job at interval: ', sendNotificationsInterval)
  if (!(sendNotificationsInterval > 0)) throw new Error('SEND_NOTIFICATIONS_INTERVAL must be a positive number')
  sendOrderEmailNotificationJob(sendNotificationsInterval)
}

if (shouldCheckForStuckOrders) {
  const stuckOrderCheckInterval = Number(STUCK_ORDER_CHECK_INTERVAL)
  logger.info('Processing stuck order check job at interval: ', stuckOrderCheckInterval)
  if (!(stuckOrderCheckInterval > 0)) throw new Error('STUCK_ORDER_CHECK_INTERVAL must be a positive number')
  checkForStuckOrdersJob(stuckOrderCheckInterval)
}

if (shouldCheckForFullGiftCardOrders) {
  const fullGiftCardOrderCheckInterval = Number(FULL_GIFT_CARD_ORDER_CHECK_INTERVAL)
  logger.info('Processing stuck order check job at interval: ', fullGiftCardOrderCheckInterval)
  if (!(fullGiftCardOrderCheckInterval > 0)) throw new Error('FULL_GIFT_CARD_ORDER_CHECK_INTERVAL must be a positive number')
  checkForFullGiftCardOrdersJob(fullGiftCardOrderCheckInterval)
}

if (shouldSendAlgoliaInfo) {
  const sendAlgoliaInfoInterval = Number(SEND_ALGOLIA_INFO_INTERVAL)
  logger.info('Processing Algolia job at interval: ', sendAlgoliaInfoInterval)
  if (!(sendAlgoliaInfoInterval > 0)) throw new Error('SEND_ALGOLIA_INFO_INTERVAL must be a positive number')
  sendConversionsToAlgoliaJob(sendAlgoliaInfoInterval)
}

if (shouldSendOrderNarvar) {
  const sendToNarvarInterval = Number(SEND_NARVAR_ORDERS_INTERVAL)
  logger.info('Processing Narvar job at interval: ', sendToNarvarInterval)
  if (!(sendToNarvarInterval > 0)) throw Error('SEND_NARVAR_ORDERS_INTERVAL must be a positive number')
  sendOrdersToNarvarJob(sendToNarvarInterval)
}

if (shouldSendOrderBold) {
  const sendOrdersToBoldInterval = Number(SEND_BOLD_ORDERS_INTERVAL)
  logger.info('Processing Bold job at interval: ', sendOrdersToBoldInterval)
  if (!(sendOrdersToBoldInterval > 0)) throw Error('SEND_BOLD_ORDERS_INTERVAL must be a positive number')
  sendOrdersToBoldJob(sendOrdersToBoldInterval)
}

if (shouldSendOrdersStatusPendingToLogs) {
  const sendOrdersStatusPendingToLogsInterval = Number(SEND_ORDERS_STATUS_PENDING_TO_LOGS_INTERVAL)
  logger.info('Processing Report_Orders_Narvar job at interval: ', sendOrdersStatusPendingToLogsInterval)
  if (!(sendOrdersStatusPendingToLogsInterval>0)) throw Error('SEND_ORDERS_STATUS_PENDING_TO_LOGS_INTERVAL must be a positive number')
  sendOrdersStatusPendingToLogsJob(sendOrdersStatusPendingToLogsInterval)
}

//TODO: Remove/Investigate as this is not enabled in Production ->  https://harryrosen.atlassian.net/browse/HRC-6643
if (shouldSendCjConversions) {
  const sendCjConversionsInterval = Number(SEND_CJ_CONVERSIONS_INTERVAL)
  logger.info('Processing CJ job at interval: ', sendCjConversionsInterval)
  if (!(sendCjConversionsInterval > 0)) throw new Error('SEND_CJ_CONVERSIONS_INTERVAL must be a positive number')
  startCjConversionJob(sendCjConversionsInterval)
}

if (shouldSendOrderSegment) {
  const sendToSegmentInterval = Number(SEND_SEGMENT_ORDERS_INTERVAL)
  logger.info('Processing Segment job at interval: ', sendToSegmentInterval)
  if (!(sendToSegmentInterval > 0)) throw Error('SEND_SEGMENT_ORDERS_INTERVAL must be a positive number')
  sendOrdersToSegmentJob(sendToSegmentInterval)
}