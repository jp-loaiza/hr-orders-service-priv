const { getDYReportEventFromOrder } = require('./dynamicYield')
const BASE_ORDER = require('./example-orders/24845933.json')

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
    expect(event.properties.uniqueTransactionId).toBe('3f738305-a705-48e1-8e57-fe60a3a759a0')
    expect(event.properties.value).toBe(584.73)
    expect(event.properties.currency).toBe('CAD')
    expect(event.properties.cart).toEqual([
      {
        productId: '20047537',
        quantity: 1,
        itemPrice: 252.74
      },
      {
        productId: '20041790',
        quantity: 1,
        itemPrice: 136.99
      },
      {
        productId: '20052889',
        quantity: 1,
        itemPrice: 175.00
      }
    ])
  })
})

const clone = (obj) => JSON.parse(JSON.stringify(obj))
