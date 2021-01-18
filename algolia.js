// @ts-ignore no types are available for `search-insights`: https://github.com/algolia/search-insights.js/issues/9
const algoliaAnalytics = require('search-insights')
const { ALGOLIA_APP_ID, ALGOLIA_API_KEY } = require('./config')

// Note: This does not throw an error or return any response indicating whether
// it initialized successfully
algoliaAnalytics('init', {
  appId: ALGOLIA_APP_ID,
  apiKey: ALGOLIA_API_KEY
})

/**
 * @param {import('./orders').LineItem} lineItem
 * @returns {import('./orders').AlgoliaAnalyticsData | undefined}
 */
const getConversionFromLineItem = lineItem => lineItem.custom && lineItem.custom.fields.algoliaAnalyticsData && lineItem.custom.fields.algoliaAnalyticsData.obj.value

/**
 * @param {import('./orders').Order} order
 * @returns {Array<import('./orders').AlgoliaAnalyticsData>}
 */
// @ts-ignore typescript doesn't understand that any undefined items have been filtered from the resulting array
const getConversionsFromOrder = order => order.lineItems.map(getConversionFromLineItem).filter(Boolean)

/**
 * @param {import('./orders').AlgoliaAnalyticsData} conversion
 */
const sendSingleConversionToAlgolia = conversion => {
  const conversionType = conversion.queryID ? 'convertedObjectIDsAfterSearch' : 'convertedObjectIDs'
  // Note: `algoliaAnalytics` does not throw an error or return any response
  // indicating whether the request was successfully sent to Algolia. This is a
  // limitation of the Algolia Search Insights JavaScript SDK. See
  // https://github.com/algolia/search-insights.js/issues/245. As a result, we
  // have to simply assume that the request was successful.
  return algoliaAnalytics(conversionType, conversion)
}

/**
 * @param {Array<import('./orders').AlgoliaAnalyticsData>} conversions
 */
const sendManyConversionsToAlgolia = conversions => Promise.all(conversions.map(sendSingleConversionToAlgolia))

module.exports = {
  getConversionsFromOrder,
  sendManyConversionsToAlgolia
}
