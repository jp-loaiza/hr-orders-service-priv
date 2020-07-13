const dotenv = require('dotenv')

const {
  BACKOFF,
  KEEP_ALIVE_INTERVAL,
  SEND_ORDER_RETRY_LIMIT,
  SENT_TO_OMS_STATUSES
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
    .catch((/** @type {Error} */error) => {
      console.error('CommerceTools client failed: ', error)
    })
}

keepAlive()
setInterval(keepAlive, KEEP_ALIVE_INTERVAL)

/**
 * @param {string} orderId
 * @returns {Promise<import('./orders').Order>}
 */
const fetchFullOrder = async orderId => {
  // See https://docs.commercetools.com/http-api.html#reference-expansion
  const expansionParams = '?expand=lineItems[*].custom.fields.barcodeData[*]&expand=paymentInfo.payments[*]'
  const uri = requestBuilder.orders.byId(orderId).build() + expansionParams
  return (await ctClient.execute({ method: 'GET', uri })).body
}

/** Fetches all orders that that we should try to send to the OMS. Includes
 *  both orders that we have never tried to send to the OMS, and ones that
 *  it is time to re-try sending to the OMS.
 * @returns {Promise<Array<(import('./orders').Order)>>}
 */
const fetchOrdersThatShouldBeSentToOms = async () => {
  const query = `custom(fields(sentToOmsStatus = "${SENT_TO_OMS_STATUSES.PENDING}")) and custom(fields(nextRetryAt <= "${(new Date().toJSON())}" or nextRetryAt is not defined))`
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })

  // The orders that we get back from the query aren't reference-expanded,
  // so we need to make an additional request to CT for each order to get the
  // reference-expanded version of the order
  const orderIds = body.results.map(( /** @type {import('./orders').Order} */ order) => order.id)
  return await Promise.all(orderIds.map(fetchFullOrder))
}

/**
 * @param {import('./orders').Order} order
 */
const setOrderAsSentToOms = order => {
  const uri = requestBuilder.orders.byId(order.id).build()

  const body = JSON.stringify({
    version: order.version,
    actions: [
      {
        action: 'setCustomField',
        name: 'sentToOmsStatus',
        value: SENT_TO_OMS_STATUSES.SUCCESS
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
 */
const setOrderErrorFields = async (order, errorMessage, errorIsRecoverable) => {
  const uri = requestBuilder.orders.byId(order.id).build()
  const retryCount =  order.custom.fields.retryCount === undefined ? 0 : order.custom.fields.retryCount + 1
  const shouldRetry = errorIsRecoverable && (retryCount < SEND_ORDER_RETRY_LIMIT)
  const nextRetryAt = shouldRetry ? getNextRetryDateFromRetryCount(retryCount) : null
  const sentToOmsStatus = shouldRetry ? SENT_TO_OMS_STATUSES.PENDING : SENT_TO_OMS_STATUSES.FAILURE

  const actions = getActionsFromCustomFields({
    retryCount,
    errorMessage,
    sentToOmsStatus,
    ...errorIsRecoverable ? { nextRetryAt } : {},
  })
  const body = JSON.stringify({ version: order.version, actions })

  return ctClient.execute({ method: 'POST', uri, body })
}

module.exports = {
  fetchOrdersThatShouldBeSentToOms,
  getActionsFromCustomFields,
  getNextRetryDateFromRetryCount,
  setOrderAsSentToOms,
  setOrderErrorFields,
  keepAliveRequest
}
