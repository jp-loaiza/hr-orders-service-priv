const { URLSearchParams } = require('url')
const https = require('https')
const dontValidateCertAgent = new https.Agent({
  rejectUnauthorized: false
})
const { JESTA_RESPONSE_STATES } = require('./jesta.constants')
const { getJestaApiResponseState } = require('./jesta.utils')
const { ONLINE_SITE_ID } = require('../constants')
const { fetchWithTimeout } = require('../request.utils.js')

const { JESTA_API_HOST,
  JESTA_API_USERNAME,
  JESTA_API_PASSWORD,
  ENVIRONMENT } = (/** @type {import('../orders').Env} */ (process.env))

/**
 * 
 * @param {string} accessToken 
 * @param {string} orderNumber 
 * @param {string} orderStatus 
 * @param {string} cartSourceWebsite 
 */
const updateJestaOrder = async (accessToken, orderNumber, orderStatus, cartSourceWebsite) => {
  const jestaUpdateOrderUrl = JESTA_API_HOST + `/Omni/OrderShipments/${orderStatus}`
  
  return fetchWithTimeout(jestaUpdateOrderUrl, {
    body: JSON.stringify({
      WebTransactionId: orderNumber,
      BusinessUnitId: 1,
      SiteId: cartSourceWebsite || ONLINE_SITE_ID
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
      'OData-Version': '4.0',
      Authorization: `Bearer ${accessToken}`
    }, 
    method: 'POST',
    agent: ENVIRONMENT === 'development' || ENVIRONMENT === 'staging' ? dontValidateCertAgent : null
  }, true)
}

const getJestaApiAccessToken = async () => {
  const jestaAuthUrl = JESTA_API_HOST + '/OAuth/Token'
  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  params.append('client_id', JESTA_API_USERNAME)
  params.append('client_secret', JESTA_API_PASSWORD)

  return fetchWithTimeout(jestaAuthUrl, {
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    }, 
    method: 'POST',
    agent: ENVIRONMENT === 'development' || ENVIRONMENT === 'staging' ? dontValidateCertAgent : null
  })
}

/**
 * @param {string} orderNumber
 * @param {string} orderStatus
 * @param {string} cartSourceWebsite
 */
const sendOrderUpdateToJesta = async (orderNumber, orderStatus, cartSourceWebsite) => {
  const jestaApiAccessToken = (await getJestaApiAccessToken()).access_token
  const response = await updateJestaOrder(jestaApiAccessToken, orderNumber, orderStatus, cartSourceWebsite)
  const responseState = getJestaApiResponseState(response)
  if (responseState === JESTA_RESPONSE_STATES.FAILURE) throw new Error(`Invalid or failure Jesta response: ${JSON.stringify(response)}`)
  if (responseState === JESTA_RESPONSE_STATES.WARNING) console.warn(`Unexpected Jesta response for order: ${orderNumber}, status: '${orderStatus}': ${JSON.stringify(response)}`)
  return response
}

module.exports = {
  sendOrderUpdateToJesta,
  getJestaApiResponseState
}
