const { getConversionsFromOrder } = require('./algolia')

const analyticsData = {
  userToken: 'user-123456',
  eventName: 'book_click_on_search_page',
  eventType: 'conversion',
  index: 'my_online_bookshop_index',
  objectIDs: ['9780545139700']
}

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

  it('adds a conversion event type to conversions that lack one', () => {
    const lineItemThatHasAnalyticsDataMissingAnEventType = {
      quantity: 1,
      custom: {
        fields: {
          algoliaAnalyticsData: {
            obj: {
              value: {
                userToken: 'user-123456',
                eventName: 'book_click_on_search_page',
                index: 'my_online_bookshop_index',
                objectIDs: ['9780545139700']
              }
            }
          }
        }
      }
    }

    const orderWithAnalyticsDataMissingAnEventTyle = {
      lineItems: [lineItemThatHasAnalyticsDataMissingAnEventType]
    }

    // @ts-ignore incomplete order for testing
    expect(getConversionsFromOrder(orderWithAnalyticsDataMissingAnEventTyle)).toEqual([
      { ...analyticsData, eventType: 'conversion' }
    ])
  })
})
