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
} = require('./constants')

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

// commercetools SDK setup
const projectKey = process.env.CT_PROJECT_KEY
const oauthHost = process.env.CT_OAUTH_HOST
const host = process.env.CT_HOST
const clientId =  process.env.CT_CLIENT_ID
const clientSecret = process.env.CT_CLIENT_SECRET

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
      scopes: [`manage_orders:${projectKey}`, `view_payments:${projectKey}`],
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

async function keepAliveRequest () {
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

/**
 * @param {string} orderId
 * @param {string} name
 * @param {any} value
 */
const setOrderCustomField = async (orderId, name, value) => {
  const uri = requestBuilder.orders.byId(orderId).build()
  const { version } = (await ctClient.execute({ method: 'GET', uri })).body
  const body = JSON.stringify({
    version: version,
    actions: [
      {
        action: 'setCustomField',
        name,
        value
      }
    ]
  })
  return ctClient.execute({ method: 'POST', uri, body })
}

/**
 * Fetches all orders that need to be updated in OMS
 * @returns {Promise<{orders: Array<import('./orders').Order>, total: number}>}
 */
async function fetchOrdersThatShouldBeUpdatedInOMS () {
  const query = `custom(fields(omsUpdate = "${UPDATE_TO_OMS_STATUSES.PENDING}")) and custom(fields(sentToOmsStatus = "${SENT_TO_OMS_STATUSES.SUCCESS}")) and (custom(fields(omsUpdateNextRetryAt <= "${(new Date().toJSON())}" or omsUpdateNextRetryAt is not defined)))`
  const uri = requestBuilder.orders.where(query).expand('paymentInfo.payments[*].paymentStatus.state').build()
  const { body } = await ctClient.execute({ method: 'GET', uri })

  return { orders: body.results, total: body.total }
}

/**
 * Fetches all orders that that we should try to send to the Notification Service.
 * @returns {Promise<{ orderIds: Array<string>, total: number }>}
 */
async function fetchOrderIdsThatShouldBeSentToCrm () {
  const query = `custom(fields(sentToCrmStatus = "${SENT_TO_CRM_STATUS.PENDING}" or sentToCrmStatus is not defined)) and custom is defined`
  // CRM is easily overloaded, so we limit the number of parallel requests to one.
  const uri = requestBuilder.orders.perPage(1).where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  /**
   * @type Array<string>
   */
  const orderIds = body.results.map((/** @type {import('./orders').Order} */ order) => order.id)
  return { orderIds, total: body.total }
}

/**
 * @param {string} orderId
 * @param {boolean} status
 */
function setOrderSentToCrmStatus (orderId, status) {
  return setOrderCustomField(orderId, 'sentToCrmStatus', SENT_TO_CRM_STATUS[status ? 'SUCCESS' : 'FAILURE'])
}

/**
 * @param {string} orderId
 * @returns {Promise<import('./orders').Order>}
 */
const fetchFullOrder = async orderId => {
  // See https://docs.commercetools.com/http-api.html#reference-expansion
  const uri = requestBuilder.orders.byId(orderId)
    .expand('lineItems[*].variant.attributes[*].value[*]')
    .expand('paymentInfo.payments[*].paymentStatus.state')
    .expand('lineItems[*].custom.fields.algoliaAnalyticsData')
    .expand('custom.fields.dynamicYieldData')
    .build()
  const order = (await ctClient.execute({ method: 'GET', uri })).body
  return !order.locale ? { ...order, locale: 'en-CA' } : order
}

/** Fetches all orders that that we should try to send to the OMS. Includes
 *  both orders that we have never tried to send to the OMS, and ones that
 *  it is time to re-try sending to the OMS. Excludes orders that lack
 *  LoginRadius UIDs.
 * @returns {Promise<{orders: Array<(import('./orders').Order)>, total: number}>}
 */
const fetchOrdersThatShouldBeSentToOms = async () => {
  const query = `custom(fields(sentToOmsStatus != "${SENT_TO_OMS_STATUSES.FAILURE}")) and custom(fields(sentToOmsStatus != "${SENT_TO_OMS_STATUSES.SUCCESS}")) and (custom(fields(nextRetryAt <= "${(new Date().toJSON())}" or nextRetryAt is not defined))) and custom(fields(loginRadiusUid is defined))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })

  // The orders that we get back from the query aren't reference-expanded,
  // so we need to make an additional request to CT for each order to get the
  // reference-expanded version of the order
  /**
   * @type Array<string>
   */
  const orderIds = body.results.map(( /** @type {import('./orders').Order} */ order) => order.id)
  return { orders: await Promise.all(orderIds.map(fetchFullOrder)), total: body.total }
}

/**
 * An order counts as "stuck" if it's neither succeeded or failed to be processed within a configurable time.
 * @returns {Promise<{results: Array<import('./orders').Order>, total: number}>}
 */
const fetchStuckOrderResults = async () => {
  const staleOrderCutoffTimeMs = Number(process.env.STALE_ORDER_CUTOFF_TIME_MS) > 0 ? Number(process.env.STALE_ORDER_CUTOFF_TIME_MS) : DEFAULT_STALE_ORDER_CUTOFF_TIME_MS
  const staleOrderCutoffDate = new Date(Date.now() - staleOrderCutoffTimeMs)
  const query = `(custom(fields(sentToOmsStatus = "${SENT_TO_OMS_STATUSES.PENDING}")) or custom(fields(sentToOmsStatus is not defined))) and createdAt <= "${(staleOrderCutoffDate.toJSON())}"`
  const uri = requestBuilder.orders.where(query).build()
  return (await ctClient.execute({ method: 'GET', uri })).body
}

/**
 * @param {import('./orders').Order} order
 * @param {string} statusField
 */
function setOrderAsSentToOms (order, statusField) {
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
 * @param {import('./orders').Order} order
 * @param {string} errorMessage
 * @param {boolean} errorIsRecoverable
 * @param {object} orderCustomFields
 */
const setOrderErrorFields = async (order, errorMessage, errorIsRecoverable, { retryCountField, nextRetryAtField, statusField }) => {
  const uri = requestBuilder.orders.byId(order.id).build()
  const { version } = (await ctClient.execute({ method: 'GET', uri })).body
  const retryCount =  order.custom.fields[retryCountField] === undefined ? 0 : order.custom.fields[retryCountField] + 1

  const isOrderCreation = statusField === ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS
  const shouldRetry = errorIsRecoverable && (retryCount < (isOrderCreation ? SEND_ORDER_RETRY_LIMIT : SEND_ORDER_UPDATE_RETRY_LIMIT))
  const nextRetryAt = shouldRetry ? getNextRetryDateFromRetryCount(retryCount, isOrderCreation ? BACKOFF : ORDER_UPDATE_BACKOFF) : null

  const availableStatuses =  STATUS_FIELDS_TO_AVAILABLE_STATUSES[statusField]
  const status = shouldRetry ? availableStatuses.PENDING : availableStatuses.FAILURE

  if (status === availableStatuses.FAILURE) {
    console.error(`Order failed due to error ${errorMessage}: `, JSON.stringify(order))
  }

  const actions = getActionsFromCustomFields({
    [retryCountField]: retryCount,
    errorMessage,
    [statusField]: status,
    ...errorIsRecoverable ? { [nextRetryAtField]: nextRetryAt } : {},
  })
  const body = JSON.stringify({ version, actions })

  return ctClient.execute({ method: 'POST', uri, body })
}

/**
 * @returns {Promise<{ orders: Array<(import('./orders').Order)>, total: number }>}
 */
const fetchOrdersWhoseTrackingDataShouldBeSentToAlgolia = async () => {
  const query = `(custom(fields(sentToAlgoliaStatus = "${SENT_TO_ALGOLIA_STATUSES.PENDING}")) or custom(fields(sentToAlgoliaStatus is not defined))) and lineItems(custom(fields(algoliaAnalyticsData is defined))) and (custom(fields(${ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.ALGOLIA_CONVERSION_NEXT_RETRY_AT} is not defined)))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  const orderIds = body.results.map(( /** @type {import('./orders').Order} */ order) => order.id)
  return {
    orders: await Promise.all(orderIds.map(fetchFullOrder)),
    total: body.total
  }
}

const fetchOrdersWhoseConversionsShouldBeSentToCj = async () => {
  const query = `(custom(fields(${ORDER_CUSTOM_FIELDS.SENT_TO_CJ_STATUS} = "${SENT_TO_CJ_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.SENT_TO_CJ_STATUS} is not defined))) and custom(fields(${ORDER_CUSTOM_FIELDS.CJ_EVENT} is defined)) and (custom(fields(${ORDER_CUSTOM_FIELDS.CJ_CONVERSION_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.CJ_CONVERSION_NEXT_RETRY_AT} is not defined)))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  const orderIds = body.results.map(( /** @type {import('./orders').Order} */ order) => order.id)
  return {
    orders: await Promise.all(orderIds.map(fetchFullOrder)),
    total: body.total
  }
}

/**
 * @returns {Promise<{ orders: Array<(import('./orders').Order)>, total: number }>}
 */
const fetchOrdersWhosePurchasesShouldBeSentToDynamicYield = async () => {
  const query = `(custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS} = "${SENT_TO_DYNAMIC_YIELD_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_STATUS} is not defined))) and custom(fields(dynamicYieldData is defined)) and (custom(fields(${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.DYNAMIC_YIELD_PURCHASE_NEXT_RETRY_AT} is not defined)))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  const orderIds = body.results.map(( /** @type {import('./orders').Order} */ order) => order.id)
  return {
    orders: await Promise.all(orderIds.map(fetchFullOrder)),
    total: body.total
  }
}

/**
 * @returns {Promise<{ orders: Array<(import('./orders').Order)>, total: number }>}
 */
const fetchOrdersThatShouldBeSentToNarvar = async () => {
  const query = `(custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_STATUS} = "${SENT_TO_NARVAR_STATUSES.PENDING}")) or custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_STATUS} is not defined))) and (custom(fields(${ORDER_CUSTOM_FIELDS.NARVAR_NEXT_RETRY_AT} <= "${(new Date().toJSON())}" or ${ORDER_CUSTOM_FIELDS.NARVAR_NEXT_RETRY_AT} is not defined))) and (createdAt > "2021-10-01")`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  const orderIds = body.results.map(( /** @type {import('./orders').Order} */ order) => order.id)
  return {
    orders: await Promise.all(orderIds.map(fetchFullOrder)),
    total: body.total
  }
}

/**
 * @returns {Promise<Array<import('./orders').OrderState>>}
 */
const fetchStates = async () => {
  const uri = requestBuilder.states.build()
  const { body } = await ctClient.execute({ method: 'GET', uri })
  return body.results.map((/** @type {import('./orders').OrderState} */ result) => result)
}

/**
 * 
 * @param {string} orderNumber 
 * @returns {Promise<Array<import('./orders').Shipment>>}
 */

const fetchShipments = async orderNumber => {
  const uri = requestBuilder.customObjects.byId('shipments').where(`value(orderNumber="${orderNumber}")`).build()
  const { body } = await ctClient.execute({ method: 'GET', uri})
  return body.results
}

module.exports = {
  fetchFullOrder,
  fetchOrdersThatShouldBeSentToOms,
  fetchStuckOrderResults,
  fetchOrdersWhoseTrackingDataShouldBeSentToAlgolia,
  fetchOrdersWhoseConversionsShouldBeSentToCj,
  fetchOrdersWhosePurchasesShouldBeSentToDynamicYield,
  fetchOrdersThatShouldBeSentToNarvar,
  fetchStates,
  fetchShipments,
  getActionsFromCustomFields,
  getNextRetryDateFromRetryCount,
  setOrderAsSentToOms,
  setOrderErrorFields,
  setOrderCustomField,
  fetchOrderIdsThatShouldBeSentToCrm,
  fetchOrdersThatShouldBeUpdatedInOMS,
  setOrderSentToCrmStatus,
  keepAliveRequest
}
