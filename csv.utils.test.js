const {
  convertAndFormatDate,
  convertToDollars,
  flatten,
  formatCardExpiryDate,
  formatJestaTaxDescriptionFromBoldTaxDescription,
  getAuthorizationNumberFromPayment,
  getCardReferenceNumberFromPayment,
  getLastFourDigitsOfCardFromPayment,
  getLineTotalTaxFromLineItem,
  getParsedTaxesFromLineItem,
  getShippingTaxAmountsFromShippingTaxes,
  getShippingTaxDescriptionsFromShippingTaxes,
  getTaxTotalFromTaxedPrice,
  getBarcodeInfoFromLineItem,
  sumDollars
} = require('./csv.utils')

describe('flatten', () => {
  it('returns its argument when given a non-nested array', () => {
    expect(flatten([1,2,3])).toEqual([1,2,3])
  })

  it('returns a flattened array when given a nested array', () => {
    expect(flatten([1,[2,3]])).toEqual([1,2,3])
    expect(flatten([1,[2,[3]]])).toEqual([1,2,3])
    expect(flatten([[1,[[[2]],[3]]]])).toEqual([1,2,3])
  })

  it('returns its argument when given a non-array', () => {
    expect(flatten(1)).toEqual(1)
    expect(flatten('foo')).toEqual('foo')
  })
})

describe('convertToDollars', () => {
  it('works when the resulting dollar amount is an integer', () => {
    expect(convertToDollars(100)).toBe(1)
    expect(convertToDollars(700)).toBe(7)
  })

  it('returns 0 when given 0', () => {
    expect(convertToDollars(0)).toBe(0)
  })
})

describe('convertAndFormatDate', () => {
  it('returns a string in the format `yyyy-MM-dd HH:mm` converted to Eastern when given a valid UTC datetime string', () => {
    expect(convertAndFormatDate('2020-05-13T13:33:21.290Z')).toBe('2020-05-13 09:33')
    expect(convertAndFormatDate('2020-05-13T09:33:21.290Z')).toBe('2020-05-13 05:33')
    expect(convertAndFormatDate('2020-05-13T20:33:21.290Z')).toBe('2020-05-13 16:33')
  })
})

describe('formatCardExpiryDate', () => {
  it('formats dates correctly', () => {
    expect(formatCardExpiryDate('01-2020')).toEqual('0120')
    expect(formatCardExpiryDate('12-1939')).toEqual('1239')
  })
})

const creditCardPayment = {
  obj: {
    paymentMethodInfo: {
      method: 'Credit'
    },
    amountPlanned: {
      centAmount: 120
    },
    custom: {
      fields: {
        auth_number: 'authNumber',
        bin: '1234', // first four digits of card
        transaction_card_expiry: '01-2020',
        transaction_card_last4: '6789',
        // @ts-ignore casting to Card type
        /** @type {import('./orders').Card} */ transaction_card_type: 'visa'
      }
    }
  }
}

const nonCreditCardPayment = {...creditCardPayment, obj: { ...creditCardPayment.obj, paymentMethodInfo: { method: '' } } }


describe('getCardReferenceNumberFromPayment', () => {
  it('returns a string that is the first and last digits of the payment cart', () => {
    expect(getCardReferenceNumberFromPayment(creditCardPayment)).toBe('19')
  })

  it('returns `undefined` when given a non-credit card payment', () => {
    expect(getCardReferenceNumberFromPayment(nonCreditCardPayment)).toBeUndefined()
  })
})

describe('getLastFourDigitsOfCardFromPayment', () => {
  it('returns the last four digits of the card when given a credit card payment', () => {
    expect(getLastFourDigitsOfCardFromPayment(creditCardPayment)).toBe('6789')
  })

  it('returns `undefined` when given a non-credit card payment', () => {
    expect(getLastFourDigitsOfCardFromPayment(nonCreditCardPayment)).toBeUndefined()
  })
})

describe('getAuthorizationNumberFromPayment', () => {
  it('returns the authorization number of the payment when given a credit card payment', () => {
    expect(getAuthorizationNumberFromPayment(creditCardPayment)).toBe('authNumber')
  })

  it('returns `undefined` when given a non-credit card payment', () => {
    expect(getAuthorizationNumberFromPayment(nonCreditCardPayment)).toBeUndefined()
  })
})

const incompleteLineItem = {
  custom: {
    fields: {
      itemTaxes: JSON.stringify({
        GST: '12',
        HST: '23'
      })
    }
  },
  variant: {
    attributes: [
      {
        name: 'barcodes',
        value: [{
          obj: {
            value: {
              subType: 'UPCE',
              barcode: '89950453-01'
            }
          }
        }]
      }
    ]
  }
}

describe('getLineTotalTaxFromLineItem', () => {
  it('calculates taxes correctly', () => {
    // @ts-ignore incomplete line for testing only tax related things
    expect(getLineTotalTaxFromLineItem(incompleteLineItem)).toBe(35)
  })
})

const twoShippingTaxes = JSON.stringify({
  GST: '12',
  HST: '23'
})

const oneShippingTax = JSON.stringify({ HST: '12' })

describe('getShippingTaxAmountsFromShippingTaxes', () => {
  it('returns an array of numbers that correspond to the given shipping taxes', () => {
    expect(getShippingTaxAmountsFromShippingTaxes(twoShippingTaxes)).toEqual([12, 23])
  })

  it('returns an array of one value when given a string that has just one shipping tax set', () => {
    expect(getShippingTaxAmountsFromShippingTaxes(oneShippingTax)).toEqual([12])
  })
})

describe('getShippingTaxDescriptionsFromShippingTaxes', () => {
  it('returns an array of strings that correspond to the given tax descriptions', () => {
    expect(getShippingTaxDescriptionsFromShippingTaxes(twoShippingTaxes, 'ON')).toEqual(['GST CANADA', 'HST-ON'])
  })

  it('returns an array of one value when given a string that has just one shipping tax set', () => {
    expect(getShippingTaxDescriptionsFromShippingTaxes(oneShippingTax, 'ON')).toEqual(['HST-ON'])
  })
})

describe('getTaxTotalFromTaxedPrice', () => {
  const taxedPrice = {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'CAD',
      centAmount: 10000,
      fractionDigits: 2
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'CAD',
      centAmount: 11800,
      fractionDigits: 2
    },
    taxPortions: [
      {
        rate: 0.13,
        amount: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 1400,
          fractionDigits: 2
        },
        name: 'HST'
      },
      {
        rate: 0.09,
        amount: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 400,
          fractionDigits: 2
        },
        name: 'GST'
      },
    ]
  }
  it('returns the correct tax total when given a valid taxedPrice object', () => {
    expect(getTaxTotalFromTaxedPrice(taxedPrice)).toBe(1800)
  })
})


describe('getParsedTaxesFromLineItem', () => {
  it('returns an array of parsed tax objects with the tax amount in dollars', () => {
    // @ts-ignore incomplete line for testing only tax related things
    expect(getParsedTaxesFromLineItem(incompleteLineItem, 'ON')).toEqual([
      {
        description: 'GST CANADA',
        dollarAmount: 12,
      },
      {
        description: 'HST-ON',
        dollarAmount: 23
      }
    ])
  })
})

describe('formatJestaTaxDescriptionFromBoldTaxDescription', () => {
  it('returns the correct description when given a Bold tax description and a valid two-character province code', () => {
    expect(formatJestaTaxDescriptionFromBoldTaxDescription('GST', 'ON')).toEqual('GST CANADA')
    expect(formatJestaTaxDescriptionFromBoldTaxDescription('GST', 'PE')).toEqual('GST CANADA')
    expect(formatJestaTaxDescriptionFromBoldTaxDescription('HST', 'ON')).toEqual('HST-ON')
    expect(formatJestaTaxDescriptionFromBoldTaxDescription('PST', 'MB')).toEqual('PST-MB')
  })
})

describe('getBarcodeInfoFromLineItem', () => {
  // @ts-ignore incomplete line for testing only barcode related things
  const { number, type } = getBarcodeInfoFromLineItem(incompleteLineItem)

  it('returns the correct barcode number', () => {
    expect(number).toBe('89950453-01')
  })

  it('returns the correct type', () => {
    expect(type).toBe('UPCE')
  })

  it('throws an informative error if the line item lacks a barcode', () => {
    const lineItemThatLacksBarcodes = {...incompleteLineItem, variant: { sku: '-123', attributes: [] } }
    // @ts-ignore incomplete line for testing only barcode related things
    expect(() => getBarcodeInfoFromLineItem(lineItemThatLacksBarcodes)).toThrow('SKU -123 has no barcodes')
  })
})

describe('sumDollars', () => {
  it('sums whole dollar amounts correctly', () => {
    expect(sumDollars([1, 2])).toEqual(3)
    expect(sumDollars([1])).toEqual(1)
    expect(sumDollars([1, 2, 3])).toEqual(6)
  })

  it('sums fractional dollar amounts correctly', () => {
    expect(sumDollars([0.1, 0.1, 0.1])).toEqual(0.3)
    expect(sumDollars([2.5, 1.5])).toEqual(4)
  })
})