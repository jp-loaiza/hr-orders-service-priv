import { AlgoliaAnalyticsData, LineItem } from "../orders"

import { fetchWithTimeout as fetch } from '../request.utils'
import { ALGOLIA_APP_ID, ALGOLIA_API_KEY } from '../config'
import { ALGOLIA_INSIGHTS_URL } from '../constants'

/**
 * @param {Array<import('../orders').AlgoliaAnalyticsData>} conversions 
 */
const formatAlgoliaRequestOptionsFromConversions = (conversions: AlgoliaAnalyticsData) => ({
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
 * @param {import('../orders').LineItem} lineItem
 * @returns {import('../orders').AlgoliaAnalyticsData | undefined}
 */
const getConversionFromLineItem = (lineItem: LineItem) => {
  const conversion = lineItem.custom && lineItem.custom.fields.algoliaAnalyticsData && lineItem.custom.fields.algoliaAnalyticsData.obj.value
  return conversion && { eventType: 'conversion', ...conversion }
}

/**
 * @param {import('@commercetools/platform-sdk').Order} order
 * @returns {Array<import('../orders').AlgoliaAnalyticsData>}
 */
// @ts-ignore typescript doesn't understand that any undefined items have been filtered from the resulting array
export const getConversionsFromOrder = (order: Order) => order.lineItems.map(getConversionFromLineItem).filter(Boolean)

/**
 * @param {Array<import('../orders').AlgoliaAnalyticsData>} conversions
 */
export const sendManyConversionsToAlgolia = (conversions: AlgoliaAnalyticsData) =>
  fetch(`${ALGOLIA_INSIGHTS_URL}/1/events`, formatAlgoliaRequestOptionsFromConversions(conversions))
