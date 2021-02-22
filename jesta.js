const { JESTA_RESPONSE_STATES, FAILURE_CODES, WARNING_CODES, SUCCESS_CODES } = require('./jesta.constants')
const { URLSearchParams } = require('url')
const https = require('https')
const dontValidateCertAgent = new https.Agent({
  rejectUnauthorized: false
})
const { ONLINE_SITE_ID } = require('./constants')
const { fetchWithTimeout } = require('./request.utils.js')

const { JESTA_API_HOST,
  JESTA_API_USERNAME,
  JESTA_API_PASSWORD,
  ENVIRONMENT } = (/** @type {import('./orders').Env} */ (process.env))

/**
 * @param {import('./orders').JestaApiResponseBody} response 
 * @returns {'failure'|'success'|'warning'}
 */
const getJestaApiResponseState = response => {
  if (!response || typeof response !== 'object' || !response.ReturnCode) return JESTA_RESPONSE_STATES.FAILURE
  if (FAILURE_CODES.includes(response.ReturnCode)) return JESTA_RESPONSE_STATES.FAILURE
  if (WARNING_CODES.includes(response.ReturnCode)) return JESTA_RESPONSE_STATES.WARNING
  if (SUCCESS_CODES.includes(response.ReturnCode)) return JESTA_RESPONSE_STATES.SUCCESS
  return JESTA_RESPONSE_STATES.FAILURE
}

/**
 * 
 * @param {string} accessToken 
 * @param {string} orderNumber 
 * @param {string} orderStatus 
 */
const updateJestaOrder = async (accessToken, orderNumber, orderStatus) => {
  const jestaUpdateOrderUrl = JESTA_API_HOST + `/Edom/SalesOrders/${orderStatus}`
  
  return fetchWithTimeout(jestaUpdateOrderUrl, {
    body: JSON.stringify({
      WebTransactionId: orderNumber,
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
 */
const sendOrderUpdateToJesta = async (orderNumber, orderStatus) => {
  const jestaApiAccessToken = (await getJestaApiAccessToken()).access_token
  return updateJestaOrder(jestaApiAccessToken, orderNumber, orderStatus)
}

module.exports = {
  sendOrderUpdateToJesta,
  getJestaApiResponseState
}
