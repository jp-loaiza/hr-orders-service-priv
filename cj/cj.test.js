const { getUrlParamMappingFromOrder } = require('./cj')
const orderWithOneLineItemAndNoDiscounts = require('../example-orders/24596603.json')
const orderWithManyLineItemsAndNoDiscounts = require('../example-orders/24600493.json')
const orderWithManyLineItemsAndOneDiscount = require('../example-orders/25068048.json')

describe('getUrlParamMappingFromOrder', () => {
  it('returns a correct mapping for an order with one line item and no discounts', () => {
    expect(getUrlParamMappingFromOrder(orderWithOneLineItemAndNoDiscounts)).toEqual({
      AMT1: 135,
      CID: 'CJ_CID',
      CJEVENT: 'XBMn0HYfI5Ky3Yt6AU7I',
      DCNT1: 0,
      ITEM1: '-2924861',
      OID: '24596603',
      QTY1: 1,
      TYPE: 'CJ_TYPE',
      amount: 135,
      coupon: undefined,
      currency: 'CAD',
      discount: 0,
      eventTime: '2020-08-20T19:20:50.501Z',
      method: 'S2S',
      signature: 'CJ_SIGNATURE'
    })
  })

  it('returns a correct mapping for an order with many line items and no discounts', () => {
    expect(getUrlParamMappingFromOrder(orderWithManyLineItemsAndNoDiscounts)).toEqual({
      AMT1: 698,
      AMT2: 80,
      CID: 'CJ_CID',
      CJEVENT: 'XBMn0HYfI5Ky3Yt6AU7I',
      DCNT1: 0,
      DCNT2: 0,
      ITEM1: '-2995152',
      ITEM2: '-2978228',
      OID: '24600493',
      QTY1: 1,
      QTY2: 1,
      TYPE: 'CJ_TYPE',
      amount: 778,
      coupon: undefined,
      currency: 'CAD',
      discount: 0,
      eventTime: '2020-08-20T19:58:43.487Z',
      method: 'S2S',
      signature: 'CJ_SIGNATURE'
    })
  })

  it('returns a correct mapping for an order many line items and one discount but not cart discount codes', () => {
    expect(getUrlParamMappingFromOrder(orderWithManyLineItemsAndOneDiscount)).toEqual({
      AMT1: 119.99,
      AMT2: 95,
      CID: 'CJ_CID',
      CJEVENT: 'XBMn0HYfI5Ky3Yt6AU7I',
      DCNT1: 40,
      DCNT2: 0,
      ITEM1: '-2932096',
      ITEM2: '-2895773',
      OID: '25068048',
      QTY1: 1,
      QTY2: 1,
      TYPE: 'CJ_TYPE',
      amount: 214.99,
      coupon: undefined,
      currency: 'CAD',
      discount: 40,
      eventTime: '2020-08-27T15:26:31.745Z',
      method: 'S2S',
      signature: 'CJ_SIGNATURE'
    })
  })

  it('returns a correct mapping for an order many line items and one discount and many cart discount codes', () => {
    const orderWithCartDiscountCodes = {
      ...orderWithManyLineItemsAndOneDiscount,
      discountCodes: [
        {
          discountCode: {
            typeId: 'discount-code',
            id: '52f6c912-3bbd-4224-ae97-147f930b65b0'
          },
          state: 'MatchesCart'
        },
        {
          discountCode: {
            typeId: 'discount-code',
            id: '396b959d-5dc7-46c0-8ea0-5d816bb2b8f3'
          },
          state: 'MatchesCart'
        }
      ]
    }

    expect(getUrlParamMappingFromOrder(orderWithCartDiscountCodes)).toEqual({
      AMT1: 119.99,
      AMT2: 95,
      CID: 'CJ_CID',
      CJEVENT: 'XBMn0HYfI5Ky3Yt6AU7I',
      DCNT1: 40,
      DCNT2: 0,
      ITEM1: '-2932096',
      ITEM2: '-2895773',
      OID: '25068048',
      QTY1: 1,
      QTY2: 1,
      TYPE: 'CJ_TYPE',
      amount: 214.99,
      coupon: '52f6c912-3bbd-4224-ae97-147f930b65b0,396b959d-5dc7-46c0-8ea0-5d816bb2b8f3',
      currency: 'CAD',
      discount: 40,
      eventTime: '2020-08-27T15:26:31.745Z',
      method: 'S2S',
      signature: 'CJ_SIGNATURE'
    })
  })
})
