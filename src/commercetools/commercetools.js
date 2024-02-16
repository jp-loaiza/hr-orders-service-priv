const dotenv = require('dotenv')

const {
  BACKOFF,
  ORDER_CUSTOM_FIELDS,
  ORDER_UPDATE_BACKOFF,
  DEFAULT_STALE_ORDER_CUTOFF_TIME_MS,
  KEEP_ALIVE_INTERVAL,
  SEND_ORDER_RETRY_LIMIT,
  SEND_ORDER_UPDATE_RETRY_LIMIT,
  SENT_TO_CJ_STATUSES,
  SENT_TO_OMS_STATUSES,
  UPDATE_TO_OMS_STATUSES,
  SENT_TO_ALGOLIA_STATUSES,
  SENT_TO_DYNAMIC_YIELD_STATUSES,
  SENT_TO_NARVAR_STATUSES,
  SENT_TO_CRM_STATUS,
  STATUS_FIELDS_TO_AVAILABLE_STATUSES,
  SENT_TO_SEGMENT_STATUSES,
} = require('../constants')

const {
  DISABLE_ORDER_SAVE_ACTOR
} = require('../config')
const { default: OrderSaveProducer } = require('../events/OrderSaveProducer')
const { default: kafkaClient } = require('../events/kafkaClient')

dotenv.config()

// commercetools SDK
const fetch = require('node-fetch')
// @ts-ignore no types available for commercetools sdk
const { createClient } = require('@commercetools/sdk-client')
// @ts-ignore no types available for commercetools sdk
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
// @ts-ignore no types available for commercetools sdk
const { createRequestBuilder } = require('@commercetools/api-request-builder')
// @ts-ignore no types available for commercetools sdk
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const { default: logger, serializeError } = require('../logger')
const { apiRoot } = require('./ctClientV2')

// commercetools SDK setup
const projectKey = process.env.CT_PROJECT_KEY
const oauthHost = process.env.CT_OAUTH_HOST
const host = process.env.CT_HOST
const clientId = process.env.CT_CLIENT_ID
const clientSecret = process.env.CT_CLIENT_SECRET
const ctScopes = process.env.CT_SCOPE ? process.env.CT_SCOPE.split(',') : []

const requestBuilder = createRequestBuilder({ projectKey })

const ctClient = createClient({
  middlewares: [
    createAuthMiddlewareForClientCredentialsFlow({
      host: oauthHost,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes: ctScopes,
      fetch,
    }),
    createHttpMiddleware({
      host,
      includeResponseHeaders: false,
      includeOriginalRequest: false,
      maskSensitiveHeaderData: false,
      enableRetry: false,
      fetch
    })
  ],
})

async function keepAliveRequest() {
  const uri = requestBuilder.orders.build()
  await ctClient.execute({
    uri,
    method: 'GET'
  })
}

const keepAlive = async () => {
  await keepAliveRequest()
    .then(() => {
      console.log('CommerceTools client success.')
    })
    .catch((/** @type {any} */error) => {
      console.error('CommerceTools client failed: ')
      if (error.body && Array.isArray(error.body.errors)) {
        error.body.errors.forEach(console.error)
      } else {
        console.error(error)
      }
    })
}

keepAlive()
setInterval(keepAlive, KEEP_ALIVE_INTERVAL)

const orderSaveProducer = new OrderSaveProducer(kafkaClient, logger)
const produceOrderSaveMsg = async (ctBody, actions) => {
  const { version, orderNumber, id, lastModifiedAt } = ctBody
  const msg = {
    MESSAGE_KEY: id,
    TIMESTAMP: Date.now(),
    ORDER_NUMBER: orderNumber,
    VERSION: version,
    LASTMODIFIEDDATE: new Date(lastModifiedAt).valueOf(),
    ACTIONS: actions
  }
  logger.info(`Order update action sending to Kafka, Order number: ${orderNumber}`)
  try {
    await orderSaveProducer.connect()
    await orderSaveProducer.send(msg, id)
    await orderSaveProducer.flush()
  } catch (e) {
    logger.error(`Order number: ${orderNumber} Failed to send kafka update action. error:`, e)
  }
  logger.info(`Order update action successfully sent to Kafka, Order number: ${orderNumber}`)
  return true
}

/**
 * @param {string} orderId
 * @param {string} name
 * @param {any} value
 */
const setOrderCustomField = async (orderId, name, value) => {
  const uri = requestBuilder.orders.byId(orderId).build()
  const ctBody = (await ctClient.execute({ method: 'GET', uri })).body

  if (DISABLE_ORDER_SAVE_ACTOR === 'false') { // Produce message in Kafka
    return produceOrderSaveMsg(ctBody, [
      {
        'action': 'setCustomField',
        'name': name,
        'value': value
      }
    ])
  } else { // old updates using jobs
    const body = {
      version: ctBody.version,
      actions: [
        {
          action: 'setCustomField',
          name,
          value
        }
      ]
    }
    return ctClient.execute({ method: 'POST', uri, body })
  }
}

/**
 * This function doesn't necessarily require only actions for custom fields. It can process any order action.
 *
 * @param {string} orderId
 * @param {string} orderVersion
 * @param {any} actions
 */
const setOrderCustomFields = async (orderId, orderVersion, actions) => {
  try {
    const uri = requestBuilder.orders.byId(orderId).build()
    const body = JSON.stringify({ version: orderVersion, actions })

    if (DISABLE_ORDER_SAVE_ACTOR === 'false') { // Produce message in Kafka
      // Query ctBody again since the body defined above does not have enough data
      const ctBody = (await ctClient.execute({ method: 'GET', uri })).body
      return produceOrderSaveMsg(ctBody, actions)
    } else {
      logger.info({
        type: 'orders_set_custom_fields',
        message: 'Updating Order',
        orderId: orderId,
        body: body,
      })
      return ctClient.execute({ method: 'POST', uri, body })
    }
  } catch (error) {

    if (error.statusCode === 409) {
      // @todo HRC-6313: Please upgrade node for null coalescing.
      if (error.body && error.body.errors && error.body.errors[0] && error.body.errors[0].currentVersion) {
        const newVersion = error.body.errors[0].currentVersion
        return setOrderCustomFields(orderId, newVersion, actions)
      }
    }

    console.error(error)

    throw error
  }
}


/**
 * Fetches all orders that need to be updated in OMS
 * @returns {Promise<{orders: Array<import('../orders').IOrder>, total: number}>}
 */
async function fetchOrdersThatShouldBeUpdatedInOMS() {
  const query = `state is defined and custom(fields(omsUpdate = "${UPDATE_TO_OMS_STATUSES.PENDING}" and sentToOmsStatus = "${SENT_TO_OMS_STATUSES.SUCCESS}" and (omsUpdateNextRetryAt <= "${(new Date().toJSON())}" or omsUpdateNextRetryAt is not defined) and posTransactionReferenceId is not defined))`
  const uri = requestBuilder.orders.where(query).expand('paymentInfo.payments[*].paymentStatus.state').build()
  const { body } = await ctClient.execute({ method: 'GET', uri })

  return { orders: body.results, total: body.total }
}

/**
 * Fetches all orders that that we should try to send to the Notification Service.
 */
async function fetchOrderIdsThatShouldBeSentToCrm() {
  const response = await apiRoot
    .orders()
    .get({
      queryArgs: {
        where: `custom is defined and orderNumber is defined and custom(fields((sentToCrmStatus = "${SENT_TO_CRM_STATUS.PENDING}" or sentToCrmStatus is not defined) and posTransactionReferenceId is not defined))`, // Staging is having weird order without orderNumber which keep spamming this job
        // CRM is easily overloaded, so we limit the number of parallel requests to one.
        limit: 1
      }
    })
    .execute()

  return { orders: response.body.results, total: response.body.total }
}

/**
 * @param {string} orderId
 * @param {boolean} status
 */
function setOrderSentToCrmStatus(orderId, status) {
  return setOrderCustomField(orderId, 'sentToCrmStatus', SENT_TO_CRM_STATUS[status ? 'SUCCESS' : 'FAILURE'])
}

/**
 * @param {string} orderId
 * @returns {Promise<import('../orders').Order>}
 */
const fetchFullOrder = async orderId => {
  // See https://docs.commercetools.com/http-api.html#reference-expansion
  const uri = requestBuilder.orders.byId(orderId)
    .expand('lineItems[*].variant.attributes[*].value[*]')
    .expand('paymentInfo.payments[*].paymentStatus.state')
    .expand('lineItems[*].custom.fields.algoliaAnalyticsData')
    .expand('custom.fields.dynamicYieldData')
    .expand('custom.fields.gtagSessionNumber')
    .expand('custom.fields.gtagSessionId')
    .expand('custom.fields.gtagClientId')
    .build()
  const order = (await ctClient.execute({ method: 'GET', uri })).body
  return !order.locale ? { ...order, locale: 'en-CA' } : order
}

/**
 * @param {string} orderId
 * @returns {Promise<import('../orders').Customer>}
 */
const fetchCustomer = async customerId => {
  return await apiRoot.customers().withId({ID: customerId}).get().execute()
}

/** Fetches all orders that that we should try to send to the OMS. Includes
 *  both orders that we have never tried to send to the OMS, and ones that
 *  it is time to re-try sending to the OMS. Excludes orders that lack
 *  LoginRadius UIDs.
 * @returns {Promise<{orders: Array<(import('../orders').IOrder)>, total: number}>}
 */
const fetchOrdersThatShouldBeSentToOms = async () => {
  const query = `custom(fields((sentToOmsStatus != "${SENT_TO_OMS_STATUSES.FAILURE}" and sentToOmsStatus != "${SENT_TO_OMS_STATUSES.SUCCESS}") and (nextRetryAt <= "${(new Date().toJSON())}" or nextRetryAt is not defined) and loginRadiusUid is defined and posTransactionReferenceId is not defined))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })

  // The orders that we get back from the query aren't reference-expanded,
  // so we need to make an additional request to CT for each order to get the
  // reference-expanded version of the order
  /**
   * @type Array<string>
   */
  const orderIds = body.results.map(( /** @type {import('../orders').Order} */ order) => order.id)
  return { orders: await Promise.all(orderIds.map(fetchFullOrder)), total: body.total }
}

/**
 * An order counts as 'stuck' if it's neither succeeded or failed to be processed within a configurable time.
 * @returns {Promise<{results: Array<import('../orders').Order>, total: number}>}
 */
const fetchStuckOrderResults = async () => {
  try {
    const staleOrderCutoffTimeMs = Number(process.env.STALE_ORDER_CUTOFF_TIME_MS) > 0 ? Number(process.env.STALE_ORDER_CUTOFF_TIME_MS) : DEFAULT_STALE_ORDER_CUTOFF_TIME_MS
    const staleOrderCutoffDate = new Date(Date.now() - staleOrderCutoffTimeMs)
    const query = `custom(fields(posTransactionReferenceId is not defined and (sentToOmsStatus = "${SENT_TO_OMS_STATUSES.PENDING}" or sentToOmsStatus is not defined))) and createdAt <= "${(staleOrderCutoffDate.toJSON())}"`
    const uri = requestBuilder.orders.where(query).build()
    return (await ctClient.execute({ method: 'GET', uri })).body
  } catch (error) {
    logger.error({
      type: 'stuck_orders_fetch_failure',
      message: 'Failed to fetch stuck orders',
      error: serializeError(error)
    })
  }

}

/**
 * @param {import('../orders').Order} order
 * @param {string} statusField
 */
function setOrderAsSentToOms(order, statusField) {
  const availableStatuses = statusField === ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS ? SENT_TO_OMS_STATUSES : UPDATE_TO_OMS_STATUSES
  return setOrderCustomField(order.id, statusField, availableStatuses.SUCCESS)
}

/**
 * @param {number} retryCount
 */
const getNextRetryDateFromRetryCount = (retryCount = 0, backoff = BACKOFF) => {
  const now = new Date().valueOf()
  return new Date(now + Math.pow(2, retryCount) * backoff)
}

/**
 *
 * @param {{[name: string]: any}} customFields
 */
const getActionsFromCustomFields = customFields => (
  Object.entries(customFields).map(([name, value]) => {
    if (value === null || value === undefined) {
      return { action: 'setCustomField', name }
    }
    return { action: 'setCustomField', name, value }
  })
)

/**
 * @param {import('../events/OrderProcessMessage').IOrder} order
 * @param {string} errorMessage
 * @param {boolean} errorIsRecoverable
 * @param {object} orderCustomFields
 */
const setOrderErrorFields = async (order, errorMessage, errorIsRecoverable, { retryCountField, nextRetryAtField, statusField }) => {
  const uri = requestBuilder.orders.byId(order.id).build()
  const ctBody = (await ctClient.execute({ method: 'GET', uri })).body
  const retryCount = order.custom.fields[retryCountField] === undefined ? 0 : order.custom.fields[retryCountField] + 1

  const isOrderCreation = statusField === ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS
  const shouldRetry = errorIsRecoverable && (retryCount < (isOrderCreation ? SEND_ORDER_RETRY_LIMIT : SEND_ORDER_UPDATE_RETRY_LIMIT))
  const nextRetryAt = shouldRetry ? getNextRetryDateFromRetryCount(retryCount, isOrderCreation ? BACKOFF : ORDER_UPDATE_BACKOFF) : null

  const availableStatuses = STATUS_FIELDS_TO_AVAILABLE_STATUSES[statusField]
  const status = shouldRetry ? availableStatuses.PENDING : availableStatuses.FAILURE

  if (status === availableStatuses.FAILURE) {
    console.error(`Order failed due to error ${errorMessage}: `, JSON.stringify(order))
  }

  const actions = getActionsFromCustomFields({
    [retryCountField]: retryCount,
    errorMessage,
    [statusField]: status,
    ...shouldRetry ? { [nextRetryAtField]: nextRetryAt } : {},
  })
  if (DISABLE_ORDER_SAVE_ACTOR === 'false') {
    return produceOrderSaveMsg(ctBody, actions)
  } else {
    const body = { version: ctBody.version, actions }
    return ctClient.execute({ method: 'POST', uri, body })
  }
}

/**
 * @returns {Promise<{ orders: Array<(import('../orders').IOrder)>, total: number }>}
 */
const fetchOrdersWhoseTrackingDataShouldBeSentToAlgolia = async () => {
  const now = new Date()
  let oneWeekAgo = new Date()
  oneWeekAgo.setDate(now.getDate() - 7)
  // CT complains about the not efficient query since we do not have any date range filter
  // The goal is to reduce the amount of response time for CT server-timing less than 25 ms
  // Using one week range filter, the response time is around 17 ms without losing any orders
  // The current retry logic indicate the total retry time should be 15000 ms
  const query = `createdAt>"${oneWeekAgo.toJSON()}" and createdAt<="${now.toJSON()}" and (custom(fields(posTransactionReferenceId is not defined and (sentToAlgoliaStatus = "${SENT_TO_ALGOLIA_STATUSES.PENDING}" or sentToAlgoliaStatus is not defined)))) and lineItems(custom(fields(algoliaAnalyticsData is defined))) and (custom(fields(${ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_NEXT_RETRY_AT} <= "${now.toJSON()}" or ${ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_NEXT_RETRY_AT} is not defined)))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  const orderIds = body.results.map(( /** @type {import('../orders').Order} */ order) => order.id)
  return {
    orders: await Promise.all(orderIds.map(fetchFullOrder)),
    total: body.total
  }
}

const fetchOrdersWhoseConversionsShouldBeSentToCj = async () => {
  const query = `custom(fields(posTransactionReferenceId is not defined and (${ORDER_CUSTOM_FIELDS.SENT_TO_CJ_STATUS} = "${SENT_TO_CJ_STATUSES.PENDING}" or ${ORDER_CUSTOM_FIELDS.SENT_TO_CJ_STATUS} is not defined) and ${ORDER_CUSTOM_FIELDS.CJ_EVENT} is defined and (${ORDER_CUSTOM_FIELDS.CJ_CONVERSION_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.CJ_CONVERSION_NEXT_RETRY_AT} is not defined)))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  const orderIds = body.results.map(( /** @type {import('../orders').Order} */ order) => order.id)
  return {
    orders: await Promise.all(orderIds.map(fetchFullOrder)),
    total: body.total
  }
}

/**
 * @returns {Promise<{ orders: Array<(import('../orders').IOrder)>, total: number }>}
 */
const fetchOrdersWhosePurchasesShouldBeSentToDynamicYield = async () => {
  const now = new Date()
  let oneWeekAgo = new Date()
  oneWeekAgo.setDate(now.getDate() - 7)
  const query = `(createdAt>"${oneWeekAgo.toJSON()}" and createdAt<="${now.toJSON()}" and (custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS} = "${SENT_TO_DYNAMIC_YIELD_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS} is not defined))) and custom(fields(dynamicYieldData is defined and posTransactionReferenceId is not defined)) and (custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_NEXT_RETRY_AT} <= "${now.toJSON()}" or ${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_NEXT_RETRY_AT} is not defined))))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  const orderIds = body.results.map(( /** @type {import('../orders').IOrder} */ order) => order.id)
  return {
    orders: await Promise.all(orderIds.map(fetchFullOrder)),
    total: body.total
  }
}

const NARVAR_BATCH_SIZE = process.env.NARVAR_BATCH_SIZE ? parseInt(process.env.NARVAR_BATCH_SIZE) : 50
const NARVAR_BATCH_SORT_RECENT = process.env.NARVAR_BATCH_SORT_RECENT === 'true' ? true : false

/**
 * @returns {Promise<{ orders: Array<(import('@commercetools/platform-sdk').Order)>, total: number }>}
 */
const fetchOrdersThatShouldBeSentToNarvar = async () => {
  const query = `(custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_STATUS} = "${SENT_TO_NARVAR_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_STATUS} is not defined))) and custom(fields((${ORDER_CUSTOM_FIELDS.NARVAR_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.NARVAR_NEXT_RETRY_AT} is not defined) and posTransactionReferenceId is not defined)) and (createdAt >= "2022-02-27")`
  const uri = requestBuilder.orders
    .where(query)
    .expand('lineItems[*].variant.attributes[*].value[*]')
    .expand('paymentInfo.payments[*].paymentStatus.state')
    .expand('lineItems[*].custom.fields.algoliaAnalyticsData')
    .expand('custom.fields.dynamicYieldData')
    .perPage(NARVAR_BATCH_SIZE)
    .sort('lastModifiedAt', NARVAR_BATCH_SORT_RECENT)
    .build()
  const { body } = await ctClient.execute({ method: 'GET', uri })

  return {
    orders: body.results,
    total: body.total
  }
}

const fetchOrdersStatusPendingThatShouldBeSentToNarvar = async () => {
  const query = `(custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_STATUS} = "${SENT_TO_NARVAR_STATUSES.PENDING}")) and custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_RETRY_COUNT}>=1)))`

  const body = await apiRoot.orders().get({queryArgs: {
    where: query,
    limit: NARVAR_BATCH_SIZE
  }}).execute()

  const ordersResult = []
  for(const order of body.body.results){
    ordersResult.push(order.orderNumber)
  }

  return {
    orders: ordersResult,
    total: body.body.total
  }
}

const fetchStates = async () => {
  const response = await apiRoot.states().get().execute()

  return response.body.results
}

/**
 *
 * @param {string} orderNumber
 * @returns {Promise<Array<import('../orders').Shipment>>}
 */

const fetchShipments = async orderNumber => {
  const uri = requestBuilder.customObjects.where(`container="shipments" and value(orderNumber="${orderNumber}")`).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  return body.results
}

/**
 *
 * @param {string} trackingNumber
 * @returns {Promise<Array<import('../orders').Shipment>>}
 */

const fetchShipmentsByTrackingNumber = async trackingNumber => {
  const uri = requestBuilder.customObjects.where(`container="shipments" and value(trackingNumber="${trackingNumber}")`).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  return body.results
}

/**
 * This function replaces the shipment with this shipment passed based on the id
 *
 * @param {import('../orders').Shipment} shipment
 */
const updateShipment = async (shipment) => {
  const method = 'POST';
  const uri = requestBuilder.customObjects.build();
  const body = JSON.stringify({
    container: 'shipments',
    key: shipment.key,
    value: shipment.value
  });
  const response = await ctClient.execute({ method, uri, body });
  return response.body;
};

const fetchOrderByNumber = async orderNumber => {
  const method = 'GET';
  const uri = requestBuilder.orders.where(`orderNumber = "${orderNumber}"`).build();
  try {
    const response = await ctClient.execute({ method, uri });
    return response.body.results[0];
  } catch (err) {
    if (err.code === 404) return null;
    throw err;
  }
}

const updateOrder = async (orderNumber, actions) => {
  try {
    const order = await fetchOrderByNumber(orderNumber)

    const method = 'POST';
    const uri = requestBuilder.orders.byId(order.id).build();
    const body = JSON.stringify({ version: order.version, actions });

    return ctClient.execute({ method, uri, body });
  } catch (error) {
    logger.error({
      type: 'update_order_failure',
      message: 'Failed to update order',
      error: serializeError(error)
    })
  }



}
/**
 *
 * @param {string} itemNumber
 * @returns {Promise<import('../orders').Product>}
 */

const fetchItemInfo = async itemNumber => {
  const query = `id ="${itemNumber}"`
  const uri = requestBuilder.products.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  return body.results[0]
}

/**
 *
 * @param {Array<string>} categoryIds
 * @returns {Promise<Array<import('../orders').ProductCategory>>}
 */

const fetchCategoryInfo = async categoryIds => {
  const query = `id in ("${categoryIds.join('","')}")`
  const uri = requestBuilder.categories.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  return body.results
}

/**
 * @returns {Promise<{ orders: Array<(import('../orders').IOrder)>, total: number }>}
 */
const fetchOrdersToSendToSegment = async () => {
  const oneMonthAgo = (new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).toJSON()
  const query = `(custom(fields(${ORDER_CUSTOM_FIELDS.SEGMENT_STATUS} = "${SENT_TO_SEGMENT_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.SEGMENT_STATUS} is not defined))) and (custom(fields(${ORDER_CUSTOM_FIELDS.LR_USER_ID} is defined and posTransactionReferenceId is not defined))) and custom(fields(${ORDER_CUSTOM_FIELDS.SEGMENT_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.SEGMENT_NEXT_RETRY_AT} is not defined)) and (createdAt > "${oneMonthAgo}")`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  const orderIds = body.results.map(( /** @type {import('../orders').IOrder} */ order) => order.id)
  return {
    orders: await Promise.all(orderIds.map(fetchFullOrder)),
    total: body.total
  }
}



module.exports = {
  fetchFullOrder,
  fetchOrdersThatShouldBeSentToOms,
  fetchStuckOrderResults,
  fetchOrdersWhoseTrackingDataShouldBeSentToAlgolia,
  fetchOrdersWhoseConversionsShouldBeSentToCj,
  fetchOrdersWhosePurchasesShouldBeSentToDynamicYield,
  fetchOrdersThatShouldBeSentToNarvar,
  fetchOrdersStatusPendingThatShouldBeSentToNarvar,
  fetchStates,
  fetchShipments,
  fetchShipmentsByTrackingNumber,
  updateShipment,
  fetchOrderByNumber,
  updateOrder,
  getActionsFromCustomFields,
  getNextRetryDateFromRetryCount,
  setOrderAsSentToOms,
  setOrderErrorFields,
  setOrderCustomField,
  setOrderCustomFields,
  fetchOrderIdsThatShouldBeSentToCrm,
  fetchOrdersThatShouldBeUpdatedInOMS,
  setOrderSentToCrmStatus,
  keepAliveRequest,
  fetchItemInfo,
  fetchCategoryInfo,
  fetchOrdersToSendToSegment,
  fetchCustomer,
}