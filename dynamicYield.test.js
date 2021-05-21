const { getDYReportEventFromOrder } = require('./dynamicYield')

jest.mock('./config')

const DYNAMIC_YIELD_DATA = Object.freeze({
  obj: {
    value: {
      user: {
        dyid: '1234567890123456789',
      },
      session: {
        dy: '8b01311c454c4d54b43ffa57c6df7301'
      }
    }
  }
})

const BASE_ORDER = Object.freeze({
  id: 'C5336C86-EC52-469C-AE37-AC8D47548540',
  totalPrice: 76500,
  lineItems: [
    {
      id: 'b3df59b9-af78-4bc0-ad69-b866f73bd5fb',
      productId: '35c42b26-e9a9-4427-8a6f-1f92ab4446e3',
      quantity: 2,
      variant: {
        sku: '-2967100'
      },
      productSlug: {
        'en-CA': '20050820',
        'fr-CA': '20050820'
      },
      price: {
        value: {
          centAmount: 15000
        }
      },
      discountedPrice: {
        value: {
          centAmount: 13500
        }
      }
    },
    {
      id: '9d9947dc-f987-4c03-8175-f166359f3d0a',
      productId: '54b8e81a-547a-49f3-a2bc-d2d2c840d0c6',
      quantity: 1,
      variant: {
        sku: '-2973273'
      },
      productSlug: {
        'en-CA': '20051312',
        'fr-CA': '20051312'
      },
      price: {
        value: {
          centAmount: 49500
        }
      }
    },
  ],
  custom: {
    fields: {
    }
  }
})

describe('getDYReportEventFromOrder', () => {
  it ('returns undefined if there is no dynamicYield custom field', () => {
    const order = clone(BASE_ORDER)
    const dyReportEvent = getDYReportEventFromOrder(order)
    expect(dyReportEvent).toBeUndefined()
  })

  it ('returns a Dynamic Yield report event body when there is a dynamicYield custom field', () => {
    const order = clone(BASE_ORDER)
    order.custom.fields.dynamicYieldData = clone(DYNAMIC_YIELD_DATA)

    const dyReportEvent = getDYReportEventFromOrder(order)
    expect(dyReportEvent.user).toEqual({ dyid: '1234567890123456789' })
    expect(dyReportEvent.session).toEqual({ dy: '8b01311c454c4d54b43ffa57c6df7301' })
    expect(dyReportEvent.events.length).toBe(1)

    const event = dyReportEvent.events[0]

    expect(event.name).toBe('Purchase')
    expect(event.properties.dyType).toBe('purchase-v1')
    expect(event.properties.uniqueTransactionId).toBe('C5336C86-EC52-469C-AE37-AC8D47548540')
    expect(event.properties.value).toBe(765)
    expect(event.properties.currency).toBe('CAD')
    expect(event.properties.cart).toEqual([
      {
        productId: '35c42b26-e9a9-4427-8a6f-1f92ab4446e3',
        quantity: 2,
        itemPrice: 135
      },
      {
        productId: '54b8e81a-547a-49f3-a2bc-d2d2c840d0c6',
        quantity: 1,
        itemPrice: 495
      }
    ])
  })
})

const clone = (obj) => JSON.parse(JSON.stringify(obj))
