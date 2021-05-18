const { getDYReportEventFromOrder } = require('./dynamicYield')

jest.mock('./config')

const DYNAMIC_YIELD_DATA = Object.freeze({
  user: {
    dyid: '1234567890123456789',
  },
  session: {
    dy: '8b01311c454c4d54b43ffa57c6df7301'
  }
})

const BASE_ORDER = Object.freeze({
  id: 'C5336C86-EC52-469C-AE37-AC8D47548540',
  totalPrice: 76500,
  lineItems: [
    {
      quantity: 2,
      variant: {
        sku: '-2967100'
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
      quantity: 1,
      variant: {
        sku: '-2973273'
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
        productId: '-2967100',
        quantity: 2,
        itemPrice: 135
      },
      {
        productId: '-2973273',
        quantity: 1,
        itemPrice: 495
      }
    ])
  })
})

const clone = (obj) => JSON.parse(JSON.stringify(obj))
