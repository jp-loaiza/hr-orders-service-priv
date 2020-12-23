// @ts-ignore no types available
const mockAlgoliaAnalytics = require('search-insights')
const { getConversionsFromOrder, sendManyConversionsToAlgolia } = require('./algolia')

jest.mock('./config')

const analyticsData = {
  userToken: 'user-123456',
  eventName: 'book_click_on_search_page',
  index: 'my_online_bookshop_index',
  objectIDs: ['9780545139700']
}

const analyticsDataWithQueryId = {
  ...analyticsData,
  queryID: 'cba8245617aeace44'
}

describe('sendManyConversionsToAlgolia', () => {
  beforeEach(() => {
    mockAlgoliaAnalytics.mockClear()
  })

  it('sends a search conversion request to Algolia when given a conversion with a query ID', async () => {
    const conversions = [analyticsDataWithQueryId]
    await sendManyConversionsToAlgolia(conversions)
    expect(mockAlgoliaAnalytics.mock.calls[0][0]).toEqual('convertedObjectIDsAfterSearch')
  })

  it('sends a normal conversion request to Algolia when given a conversion that lacks a query ID', async () => {
    const conversions = [analyticsData]
    await sendManyConversionsToAlgolia(conversions)
    expect(mockAlgoliaAnalytics.mock.calls[0][0]).toEqual('convertedObjectIDs')
  })

  it('sends one normal conversion request and one search conversion request to Algolia when given one conversion that has a query ID and one conversion that lacks a query ID', async () => {
    const conversions = [analyticsData, analyticsDataWithQueryId]
    await sendManyConversionsToAlgolia(conversions)
    expect(mockAlgoliaAnalytics.mock.calls[0][0]).toEqual('convertedObjectIDs')
    expect(mockAlgoliaAnalytics.mock.calls[1][0]).toEqual('convertedObjectIDsAfterSearch')
  })

  it('does not call Algolia when given an empty array', async () => {
    await sendManyConversionsToAlgolia([])
    expect(mockAlgoliaAnalytics).not.toHaveBeenCalled()
  })
})

describe('getConversionsFromOrder', () => {
  const lineItemThatHasAnalyticsData = {
    quantity: 1,
    custom: {
      fields: {
        algoliaAnalyticsData: {
          obj: {
            value: analyticsData
          }
        }
      }
    }
  }

  it('returns an empty array when given an order for which no line item has analytics data', () => {
    const orderWithNoAnalyticsData = {
      lineItems: [
        {
          quantity: 1
        }
      ]
    }

    // @ts-ignore incomplete order for testing
    expect(getConversionsFromOrder(orderWithNoAnalyticsData)).toEqual([])
  })

  it('returns an array with a single conversion item when one line item has analytics data and one line item does not', () => {
    const orderWithOneItemThatHasAnalyticsDataAndOneItemThatDoesNot = {
      lineItems: [
        {
          quantity: 1,
        },
        lineItemThatHasAnalyticsData
      ]
    }

    // @ts-ignore incomplete order for testing
    expect(getConversionsFromOrder(orderWithOneItemThatHasAnalyticsDataAndOneItemThatDoesNot)).toEqual([analyticsData])
  })

  it('returns an array with many conversions when many line items have analytics data', () => {
    const orderWithManyLineItemsThatHaveAnalyticsData = {
      lineItems: [
        lineItemThatHasAnalyticsData,
        lineItemThatHasAnalyticsData,
        lineItemThatHasAnalyticsData
      ]
    }

    // @ts-ignore incomplete order for testing
    expect(getConversionsFromOrder(orderWithManyLineItemsThatHaveAnalyticsData)).toEqual([analyticsData, analyticsData, analyticsData])
  })
})
