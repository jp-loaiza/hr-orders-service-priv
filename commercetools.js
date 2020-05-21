const dotenv = require('dotenv')

const { KEEP_ALIVE_INTERVAL } = require('./constants')

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
      scopes: [`manage_project:${projectKey}`],
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

const keepAlive = async () => {
  const uri = requestBuilder.customers.build()
  await ctClient.execute({
    uri,
    method: 'GET'
  })
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

/**
 * @explain Fetches all orders that we haven't already tried (successfully or
 *          unsuccessfully) to send to the OMS
 * @returns {Promise<Array<(import('./orders').Order)>>}
 */
const fetchOrdersThatShouldBeSentToOms = async () => {
  const query = 'not custom(fields(sentToOMS = true)) and custom(fields(errorMessage is not defined))'
  const uri = requestBuilder.orders.where(query).build()
  const { body } = await ctClient.execute({ method: 'GET', uri })

  // The orders that we get back from the query aren't reference-expanded,
  // so we need to make an additional request to CT for each order to get the
  // reference-expanded version of the order
  const orderIds = body.results.map(( /** @type {import('./orders').Order} */ order) => order.id)
  return await Promise.all(orderIds.map(fetchFullOrder))
}

/**
 * @param {string} name
 * @param {any} value
 * @param {boolean} createCustomType
 */
const getCustomFieldUpdateAction = (name, value, createCustomType) => {
  if (createCustomType) {
    return {
      action: 'setCustomType',
      type: {
        key: 'orderCustomFields'
      },
      fields: {
        [name]:  value
      }
    }
  }
  return {
    action: 'setCustomField',
    name,
    value
  }
}

/**
 * @param {import('./orders').Order} order
 */
const setOrderAsSentToOms = order => {
  const uri = requestBuilder.orders.byId(order.id).build()

  const body = JSON.stringify({
    version: order.version,
    actions: [
      getCustomFieldUpdateAction('sentToOMS', true, !(order.custom))
    ]
  })

  return ctClient.execute({ method: 'POST', uri, body })
}

/**
 * @param {import('./orders').Order} order 
 * @param {string} errorMessage 
 */
const setOrderErrorMessage = async (order, errorMessage) => {
  const uri = requestBuilder.orders.byId(order.id).build()

  const body = JSON.stringify({
    version: order.version,
    actions: [
      getCustomFieldUpdateAction('errorMessage', errorMessage, !(order.custom))
    ]
  })

  return ctClient.execute({ method: 'POST', uri, body })
}

module.exports = {
  fetchOrdersThatShouldBeSentToOms,
  setOrderAsSentToOms,
  setOrderErrorMessage
}
