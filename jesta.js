const fetch = require('node-fetch').default
const AbortController = require('abort-controller')
const { PAYMENT_STATES, FETCH_ABORT_TIMEOUT } = require('./constants')

const { JESTA_API_HOST,
  JESTA_API_USERNAME,
  JESTA_API_PASSWORD } = (/** @type {import('./orders').Env} */ (process.env))

/**
 * @param {import('./orders').Order} order 
 */
const formatEmailApiRequestBodyFromOrder = order => ({
  request: {
    OwnerId: EMAIL_API_OWNER_ID,
    Channel: 'Email',
    Subject: JSON.stringify({ Name: 'Salesorder', Id: order.orderNumber }),
    Topic: 'Confirmation',
    Recipient: JSON.stringify({
      address: order.customerEmail,
      locale: order.locale
    }),
    // Required even though it's blank. From CRM's documentation: "Not
    // currently implemented - This parameter will eventually be used to
    // override the sender for the communication"
    Sender: '',
    Data: JSON.stringify(order)
  }
})

const getJestaApiAccessToken = async () => {
  // @ts-ignore
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, FETCH_ABORT_TIMEOUT)

  const jestaAuthUrl = JESTA_API_HOST + `/OAuth/Token?grant_type=password&username=${JESTA_API_USERNAME}&password=${JESTA_API_PASSWORD}`

  const response = await fetch(jestaAuthUrl, {
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
  /*const error = new Error(`Jesta API responded with status ${response.status}: ${response}.`)
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
  console.log('jestaApiAccessToken', jestaApiAccessToken);
  return jestaApiAccessToken
}

module.exports = {
  formatEmailApiRequestBodyFromOrder,
  sendOrderUpdateToJesta
}
