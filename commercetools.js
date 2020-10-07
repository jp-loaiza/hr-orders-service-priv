const dotenv = require('dotenv')

const {
  BACKOFF,
  DEFAULT_STALE_ORDER_CUTOFF_TIME_MS,
  KEEP_ALIVE_INTERVAL,
  SEND_ORDER_RETRY_LIMIT,
  SEND_ORDER_UPDATE_RETRY_LIMIT,
  SENT_TO_OMS_STATUSES,
  UPDATE_TO_OMS_STATUSES,
  SENT_TO_CRM_STATUS,
  PAYMENT_STATES,
  ORDER_CUSTOM_FIELDS
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
 * Fetches all orders that need to be updated in OMS
 * @returns {Promise<Array<string>>}
 */
async function fetchOrdersThatShouldBeUpdatedInOMS () {
  const query = `custom(fields(omsUpdate = "${UPDATE_TO_OMS_STATUSES.PENDING}")) and custom(fields(sentToOmsStatus = "${SENT_TO_OMS_STATUSES.SUCCESS}")) and (custom(fields(omsUpdateNextRetryAt <= "${(new Date().toJSON())}" or omsUpdateNextRetryAt is not defined)))`
  const uri = requestBuilder.orders.where(query).expand('paymentInfo.payments[*].paymentStatus.state').build()
  const { body } = await ctClient.execute({ method: 'GET', uri })

  const ordersToUpdate = body.results.map((/** @type {import('./orders').Order} */ order) => {
    const orderUpdate = {
      id: order.id,
      orderNumber: order.orderNumber,
      custom: order.custom
    }

    const creditPayment = order.paymentInfo.payments.find(payment => payment.obj.paymentMethodInfo.method === 'credit')
    if (!creditPayment) {
      orderUpdate.errorMessage = 'No credit card payment with payment release change'
      return orderUpdate
    }
    if (creditPayment.obj.paymentStatus.state.obj.key !== PAYMENT_STATES.PAID && creditPayment.obj.paymentStatus.state.obj.key !== PAYMENT_STATES.CANCELLED) {
      orderUpdate.errorMessage = 'Order update is not for a status that jesta recognizes'
    }

    return { ...orderUpdate, status: creditPayment.obj.paymentStatus.state.obj.key }
  })
  return ordersToUpdate
}

/** 
 * Fetches all orders that that we should try to send to the Notification Service.
 * @returns {Promise<Array<string>>}
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
  return orderIds
}

/**
 * @param {string} orderId
 * @param {boolean} status
 */
async function setOrderSentToCrmStatus (orderId, status) {
  const uri = requestBuilder.orders.byId(orderId).build()
  const { version } = (await ctClient.execute({ method: 'GET', uri })).body
  const body = JSON.stringify({
    version: version,
    actions: [
      {
        action: 'setCustomField',
        name: 'sentToCrmStatus',
        value: SENT_TO_CRM_STATUS[status ? 'SUCCESS' : 'FAILURE']
      }
    ]
  })

  return ctClient.execute({ method: 'POST', uri, body })
}

/**
 * @param {string} orderId
 * @returns {Promise<import('./orders').Order>}
 */
const fetchFullOrder = async orderId => {
  // See https://docs.commercetools.com/http-api.html#reference-expansion
  const expansionParams = '?expand=lineItems[*].variant.attributes[*].value[*]&expand=paymentInfo.payments[*]'
  const uri = requestBuilder.orders.byId(orderId).build() + expansionParams
  return (await ctClient.execute({ method: 'GET', uri })).body
}

/** Fetches all orders that that we should try to send to the OMS. Includes
 *  both orders that we have never tried to send to the OMS, and ones that
 *  it is time to re-try sending to the OMS. Excludes orders that lack
 *  LoginRadius UIDs.
 * @returns {Promise<Array<(import('./orders').Order)>>}
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
  return await Promise.all(orderIds.map(fetchFullOrder))
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
async function setOrderAsSentToOms (order, statusField) {
  const uri = requestBuilder.orders.byId(order.id).build()
  const { version } = (await ctClient.execute({ method: 'GET', uri })).body

  const availableStatuses = statusField === ORDER_CUSTOM_FIELDS.SENT_TO_OMS_STATUS ? SENT_TO_OMS_STATUSES : UPDATE_TO_OMS_STATUSES

  const body = JSON.stringify({
    version: version,
    actions: [
      {
        action: 'setCustomField',
        name: statusField,
        value: availableStatuses.SUCCESS
      }
    ]
  })

  return ctClient.execute({ method: 'POST', uri, body })
}

/**
 * @param {number} retryCount
 */
const getNextRetryDateFromRetryCount = (retryCount = 0) => {
  const now = new Date().valueOf()
  return new Date(now + Math.pow(2, retryCount) * BACKOFF)
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
  const nextRetryAt = shouldRetry ? getNextRetryDateFromRetryCount(retryCount) : null

  const availableStatuses = isOrderCreation ? SENT_TO_OMS_STATUSES : UPDATE_TO_OMS_STATUSES
  const status = shouldRetry ? availableStatuses.PENDING : availableStatuses.FAILURE

  const actions = getActionsFromCustomFields({
    [retryCountField]: retryCount,
    errorMessage,
    [statusField]: status,
    ...errorIsRecoverable ? { [nextRetryAtField]: nextRetryAt } : {},
  })
  console.log('actions', actions);
  const body = JSON.stringify({ version, actions })

  return ctClient.execute({ method: 'POST', uri, body })
}

module.exports = {
  fetchFullOrder,
  fetchOrdersThatShouldBeSentToOms,
  fetchStuckOrderResults,
  getActionsFromCustomFields,
  getNextRetryDateFromRetryCount,
  setOrderAsSentToOms,
  setOrderErrorFields,
  fetchOrderIdsThatShouldBeSentToCrm,
  fetchOrdersThatShouldBeUpdatedInOMS,
  setOrderSentToCrmStatus,
  keepAliveRequest
}
