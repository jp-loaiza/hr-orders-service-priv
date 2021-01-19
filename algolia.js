const { fetchWithTimeout: fetch } = require('./request.utils')
const { ALGOLIA_APP_ID, ALGOLIA_API_KEY } = require('./config')
const { ALGOLIA_INSIGHTS_URL } = require('./constants')

/**
 * @param {Array<import('./orders').AlgoliaAnalyticsData>} conversions 
 */
const formatAlgoliaRequestOptionsFromConversions = conversions => ({
  method: 'post',
  headers: {
    'x-algolia-api-key': ALGOLIA_API_KEY,
    'x-algolia-application-id': ALGOLIA_APP_ID,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    events: conversions
  })
})

/**
 * @param {import('./orders').LineItem} lineItem
 * @returns {import('./orders').AlgoliaAnalyticsData | undefined}
 */
const getConversionFromLineItem = lineItem => {
  const conversion = lineItem.custom && lineItem.custom.fields.algoliaAnalyticsData && lineItem.custom.fields.algoliaAnalyticsData.obj.value
  return conversion && {eventType: 'conversion', ...conversion }
}

/**
 * @param {import('./orders').Order} order
 * @returns {Array<import('./orders').AlgoliaAnalyticsData>}
 */
// @ts-ignore typescript doesn't understand that any undefined items have been filtered from the resulting array
const getConversionsFromOrder = order => order.lineItems.map(getConversionFromLineItem).filter(Boolean)

/**
 * @param {Array<import('./orders').AlgoliaAnalyticsData>} conversions
 */
const sendManyConversionsToAlgolia = conversions =>
  fetch(`${ALGOLIA_INSIGHTS_URL}/1/events`, formatAlgoliaRequestOptionsFromConversions(conversions))


module.exports = {
  getConversionsFromOrder,
  sendManyConversionsToAlgolia
}
