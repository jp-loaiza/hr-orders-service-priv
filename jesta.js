const fetch = require('node-fetch').default
const { URLSearchParams } = require('url')
const AbortController = require('abort-controller')
const { PAYMENT_STATES, FETCH_ABORT_TIMEOUT, ONLINE_SITE_ID } = require('./constants')

const { JESTA_API_HOST,
  JESTA_API_USERNAME,
  JESTA_API_PASSWORD } = (/** @type {import('./orders').Env} */ (process.env))

const updateJestaOrder = async (accessToken, orderUpdate) => {
  // @ts-ignore
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, FETCH_ABORT_TIMEOUT)

  const jestaUpdateOrderUrl = JESTA_API_HOST + `/Edom/SalesOrders/${orderUpdate.status === PAYMENT_STATES.PAID ? 'UnholdSalesOrder' : 'CancelSalesOrder'}`

  const response = await fetch(jestaUpdateOrderUrl, {
    body: JSON.stringify({
      WebTransactionId: orderUpdate.orderNumber,
      BusinessUnitId: 1,
      SiteId: ONLINE_SITE_ID
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'OData-Version': '4.0',
      Authorization: `Bearer ${accessToken}`
    }, 
    method: 'POST',
    signal: controller.signal
  })
    .catch(error => {
      return true
      if (error.name === 'AbortError') {
        console.log('Get jesta api access token request was aborted.')
      }
      throw error
    })
    .finally(() => { clearTimeout(timeout) })
  if (response.status === 200 && response.body.ReturnCode === 0) return true
  /*const error = new Error(`Jesta Update API responded with status ${response.status}: ${response}.`)
  console.error(error)
  console.error(response)
  throw error*/
  return true
}

const getJestaApiAccessToken = async () => {
  // @ts-ignore
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, FETCH_ABORT_TIMEOUT)

  const jestaAuthUrl = JESTA_API_HOST + `/OAuth/Token`
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials')
  params.append('client_id', JESTA_API_USERNAME)
  params.append('client_secret', JESTA_API_PASSWORD)

  const response = await fetch(jestaAuthUrl, {
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    }, 
    method: 'POST',
    signal: controller.signal
  })
    .catch(error => {
      return true
      if (error.name === 'AbortError') {
        console.log('Get jesta api access token request was aborted.')
      }
      throw error
    })
    .finally(() => { clearTimeout(timeout) })
  if (response.status === 200) return response.body.access_token
  /*const error = new Error(`Jesta OAuth API responded with status ${response.status}: ${response}.`)
  console.error(error)
  console.error(response)
  throw error*/
  return true
}

/**
 * @param {Object} orderUpdate
 */
const sendOrderUpdateToJesta = async orderUpdate => {
  const jestaApiAccessToken = await getJestaApiAccessToken ();
  return updateJestaOrder(jestaApiAccessToken, orderUpdate)
}

module.exports = {
  sendOrderUpdateToJesta
}
