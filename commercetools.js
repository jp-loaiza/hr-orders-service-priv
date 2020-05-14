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

// Fetches all orders that we haven't already tried (successfully or
// unsuccessfully) to send to the OMS
const fetchOrdersThatShouldBeSentToOms = async () => {
  const query = 'not custom(fields(sentToOMS = true)) and custom(fields(errorMessage is not defined))'
  const uri = requestBuilder.orders.where(query).build()
  try {
    const { body } = await ctClient.execute({ method: 'GET', uri })
    return body.results
  } catch (err) {
    console.error('Failed to fetch orders:')
    console.error(err)
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
      {
        action: 'setCustomField',
        name: 'sentToOMS',
        value: true
      }
    ]
  })

  return ctClient.execute({ method: 'POST', uri, body })
}

/**
 * @param {import('./orders').Order} order 
 * @param {string} errorMessage 
 */
const setOrderErrorMessage = async (order, errorMessage) => {
  return 'TODO'
}

module.exports = {
  fetchOrdersThatShouldBeSentToOms,
  setOrderAsSentToOms,
  setOrderErrorMessage
}
