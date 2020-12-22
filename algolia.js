// @ts-ignore no types are available for `search-insights`: https://github.com/algolia/search-insights.js/issues/9
const algoliaAnalytics = require('search-insights')
const { ALGOLIA_APP_ID, ALGOLIA_API_KEY } = require('./config')

const initializeAlgoliaAnalytics = async () => {
  try {
    await algoliaAnalytics('init', {
      appId: ALGOLIA_APP_ID,
      apiKey: ALGOLIA_API_KEY
    })
    console.log('Connected to Algolia')
  } catch (error) {
    console.error('Unable to connect to Algolia:', error)
  }
}

initializeAlgoliaAnalytics()

/**
 * @param {import('./orders').LineItem} lineItem
 * @returns {import('./orders').AlgoliaAnalyticsData | undefined}
 */
const getConversionFromLineItem = lineItem => lineItem.custom && lineItem.custom.fields.algoliaAnalyticsData && lineItem.custom.fields.algoliaAnalyticsData.obj

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
