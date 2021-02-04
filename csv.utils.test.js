const {
  convertAndFormatDate,
  convertToDollars,
  flatten,
  formatCardExpiryDateFromPayment,
  formatJestaTaxDescriptionFromBoldTaxDescription,
  getAuthorizationNumberFromPayment,
  getCardReferenceNumberFromPayment,
  getLastFourDigitsOfCardFromPayment,
  getLineTotalTaxFromLineItem,
  getPaymentTotalFromPaymentInfo,
  getParsedTaxesFromLineItem,
  getShippingInfoFromShippingName,
  getShippingTaxAmountsFromShippingTaxes,
  getShippingTaxDescriptionsFromShippingTaxes,
  getTaxTotalFromTaxedPrice,
  getBarcodeInfoFromLineItem,
  lineItemIsEndlessAisle,
  sumMoney,
  getPaymentReleasedStatus,
  getFirstLastName
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
    expect(flatten(1)).toBe(1)
    expect(flatten('foo')).toBe('foo')
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

describe('formatCardExpiryDateFromPayment', () => {
  it('formats credit cart dates correctly when given credit card payments', () => {
    expect(formatCardExpiryDateFromPayment(creditCardPayment)).toBe('0120')
  })

  it('returns `undefined` when given non-credit card payments', () => {
    expect(formatCardExpiryDateFromPayment(nonCreditCardPayment)).toBeUndefined()
  })
})

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
  it('returns the difference between the total gross and total net prices', () => {
    expect(getTaxTotalFromTaxedPrice(taxedPrice)).toBe(1800)
  })

  it('does not calculate the tax total from the `taxPortions` array', () => { // `taxedPortions` as set by Bold may be missing shipping taxes
    const taxedPriceWithoutTaxPoritions = {...taxedPrice, taxPortions: [] }
    expect(getTaxTotalFromTaxedPrice(taxedPriceWithoutTaxPoritions)).toBe(1800)
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

  it('rounds to four decimal places', () => {
    const lineItemWithVeryPreciseTaxes = {
      custom: {
        fields: {
          itemTaxes: JSON.stringify({
            GST: 12.123456789
          })
        }
      }
    }
    // @ts-ignore incomplete line for testing only tax related things
    expect(getParsedTaxesFromLineItem(lineItemWithVeryPreciseTaxes)).toEqual([ { description: 'GST CANADA', dollarAmount: 12.1235 } ])
  })
})

describe('formatJestaTaxDescriptionFromBoldTaxDescription', () => {
  it('returns the correct description when given a Bold tax description and a valid two-character province code', () => {
    expect(formatJestaTaxDescriptionFromBoldTaxDescription('GST', 'ON')).toBe('GST CANADA')
    expect(formatJestaTaxDescriptionFromBoldTaxDescription('GST', 'PE')).toBe('GST CANADA')
    expect(formatJestaTaxDescriptionFromBoldTaxDescription('HST', 'ON')).toBe('HST-ON')
    expect(formatJestaTaxDescriptionFromBoldTaxDescription('PST', 'MB')).toBe('PST-MB')
  })
})

describe('getBarcodeInfoFromLineItem', () => {
  const upceBarcode = {
    obj: {
      value: {
        subType: 'UPCE',
        barcode: '89950453-01'
      }
    }
  }

  const upcaBarcode = {
    obj: {
      value: {
        subType: 'UPCA',
        barcode: '557391553'
      }
    }
  }

  it('returns the barcode number and type of the barcode when the given line item has a single barcode which is of type UPCE', () => {
    const lineItemWithOneUpceBarcode = {
      variant: {
        attributes: [
          {
            name: 'barcodes',
            value: [upceBarcode]
          }
        ]
      }
    }

    // @ts-ignore incomplete line for testing only barcode related things
    const { number, type } = getBarcodeInfoFromLineItem(lineItemWithOneUpceBarcode)
    expect(number).toBe('89950453-01')
    expect(type).toBe('UPCE')
  })

  it('returns the barcode number and type of the barcode when the given line item has a single barcode which is of type UPCA', () => {
    const lineItemWithOneUpcaBarcode = {
      variant: {
        attributes: [
          {
            name: 'barcodes',
            value: [upcaBarcode]
          }
        ]
      }
    }

    // @ts-ignore incomplete line for testing only barcode related things
    const { number, type } = getBarcodeInfoFromLineItem(lineItemWithOneUpcaBarcode)
    expect(number).toBe('557391553')
    expect(type).toBe('UPCA')
  })

  it('returns the barcode number and type of the UPCA barcode when the given line item has both a UPCE barcode and a UPCA barcode', () => {
    const lineItemWithTwoBarcodes = {
      variant: {
        attributes: [
          {
            name: 'barcodes',
            value: [upcaBarcode, upceBarcode]
          }
        ]
      }
    }

    // @ts-ignore incomplete line for testing only barcode related things
    const { number, type } = getBarcodeInfoFromLineItem(lineItemWithTwoBarcodes)
    expect(number).toBe('557391553')
    expect(type).toBe('UPCA')
  })

  it('throws an informative error if the line item has no barcodes', () => {
    const lineItemThatLacksBarcodes = {...incompleteLineItem, variant: { sku: '-123', attributes: [] } }
    // @ts-ignore incomplete line for testing only barcode related things
    expect(() => getBarcodeInfoFromLineItem(lineItemThatLacksBarcodes)).toThrow('SKU -123 has no barcodes')
  })
})

describe('sumMoney', () => {
  it('sums whole dollars correctly', () => {
    expect(sumMoney([1, 2])).toBe(3)
    expect(sumMoney([1])).toBe(1)
    expect(sumMoney([1, 2, 3])).toBe(6)
  })

  it('sums dollars with whole cent values correctly', () => {
    expect(sumMoney([0.1, 0.1, 0.1])).toBe(0.3)
    expect(sumMoney([2.5, 1.5])).toBe(4)
  })

  it('sums dollars with fractional cent values correctly', () => {
    expect(sumMoney([0.001, 0.001])).toBe(0.002)
  })

  it('rounds to four decimal places, rounding x.xxxx5 up', () => {
    expect(sumMoney([0.00004])).toBe(0)
    expect(sumMoney([0.00005])).toBe(0.0001)
    expect(sumMoney([0.00006])).toBe(0.0001)
  })
})

describe('getPaymentTotalFromPaymentInfo', () => {
  const payment1 = {
    obj: {
      amountPlanned: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 1000,
        fractionDigits: 2
      }
    }
  }

  const payment2 = {
    obj: {
      amountPlanned: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 2000,
        fractionDigits: 2
      }
    }
  }

  it('returns the payment amount in cents when given a payment info object that has only one payment', () => {
    const paymentInfo = {
      payments: [payment1]
    }

    // @ts-ignore incomplete payment info object for testing purposes
    expect(getPaymentTotalFromPaymentInfo(paymentInfo)).toBe(1000)
  })


  it('returns the sum of the payments in cents when given a payment info object that has only two payments', () => {
    const paymentInfo = {
      payments: [payment1, payment2]
    }

    // @ts-ignore incomplete payment info object for testing purposes
    expect(getPaymentTotalFromPaymentInfo(paymentInfo)).toBe(3000)
  })

  it('returns 0 when given a payment info object that has no payments', () => {
    const paymentInfo = {
      payments: []
    }

    expect(getPaymentTotalFromPaymentInfo(paymentInfo)).toBe(0)
  })
})

describe('getShippingInfoFromShippingName', () => {
  it('returns correctly parsed carrier ID when given a valid shipping name', () => {
    expect(getShippingInfoFromShippingName('Canada Post Expedited').carrierId).toBe('CP')
    expect(getShippingInfoFromShippingName('FedEx Ground').carrierId).toBe('FDX')
    expect(getShippingInfoFromShippingName('FedEx Economy').carrierId).toBe('FDX')
    expect(getShippingInfoFromShippingName('Purolator Priority Overnight').carrierId).toBe('PRL')
  })

  it('returns correctly parsed shipping service type when given a valid shipping name', () => {
    expect(getShippingInfoFromShippingName('Canada Post Expedited').shippingServiceType).toBe('EXPEDITED PARCEL')
    expect(getShippingInfoFromShippingName('FedEx Ground').shippingServiceType).toBe('GROUND')
    expect(getShippingInfoFromShippingName('FedEx Economy').shippingServiceType).toBe('ECONOMY')
    expect(getShippingInfoFromShippingName('FedEx Standard Overnight').shippingServiceType).toBe('OVERNIGHT')
    expect(getShippingInfoFromShippingName('Purolator Priority Overnight').shippingServiceType).toBe('EXPRESS')
  })

  it('parses endless aisle "Express" shipping name as FedEx Economy', () => {
    expect(getShippingInfoFromShippingName('Express').carrierId).toBe('FDX')
    expect(getShippingInfoFromShippingName('Express').shippingServiceType).toBe('ECONOMY')
  })

  it('parses endless aisle "Next Day" shipping name as FedEx Standard Overnight', () => {
    expect(getShippingInfoFromShippingName('Next Day').carrierId).toBe('FDX')
    expect(getShippingInfoFromShippingName('Next Day').shippingServiceType).toBe('OVERNIGHT')
  })

  it('parses shipping name correctly even if it starts with extra whitespace', () => {
    expect(getShippingInfoFromShippingName(' Express')).toEqual({
      carrierId: 'FDX',
      shippingServiceType: 'ECONOMY',
      shippingIsRush: false
    })
  })

  it('classifies all shipping types as rush except for `Canada Post Expedited`, `FedEx Economy`, and `Express`', () => {
    expect(getShippingInfoFromShippingName('Canada Post Expedited').shippingIsRush).toBe(false)
    expect(getShippingInfoFromShippingName('FedEx Economy').shippingIsRush).toBe(false)
    expect(getShippingInfoFromShippingName('FedEx Ground').shippingIsRush).toBe(true)
    expect(getShippingInfoFromShippingName('FedEx Standard Overnight').shippingIsRush).toBe(true)
    expect(getShippingInfoFromShippingName('Purolator Priority Overnight').shippingIsRush).toBe(true)
    expect(getShippingInfoFromShippingName('Express').shippingIsRush).toBe(false)
    expect(getShippingInfoFromShippingName('Next Day').shippingIsRush).toBe(true)
  })

  it('returns null when given a shipping name that lacks a valid carrier name', () => {
    expect(getShippingInfoFromShippingName('INVALID_CARRIER Expedited').carrierId).toBe(null)
  })

  it('returns null when given a shipping name that lacks a valid shipping service type', () => {
    expect(getShippingInfoFromShippingName('Canada Post INVALID_SHIPPING_TYPE').shippingServiceType).toBe(null)
  })

  it('any invalid shipping carriers or shipping service type should result in false of rush indicator', () => {
    expect(getShippingInfoFromShippingName('INVALID SHIPPING').shippingIsRush).toBe(false)
  })
})

describe('getPaymentReleasedStatus', () => {
  const transaction = {
    type: 'Charge',
    state: 'Success' 
  }
  const paymentInfo = {
    payments: [{
      obj: {
        paymentMethodInfo: {
          method: 'notcredit'
        },
        paymentStatus: {
          interfaceCode: 'paid' 
        },
        transactions: []
      }
    }]
  }
  it('returns "Y" if payment type is not credit no matter the transactions', () => {
    expect(getPaymentReleasedStatus(paymentInfo)).toBe('Y')
  })
  it('returns "Y" if all payment types are not credit no matter the transactions', () => {
    const multiPaymentInfo = { ...paymentInfo, payments: [paymentInfo.payments[0], { ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'stillnotcredit' } } }] }
    expect(getPaymentReleasedStatus(multiPaymentInfo)).toBe('Y')
  })
  it('returns "Y" if payment type is credit and interface code is "paid" and a transaction of "Charge" and "Success" exists', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, transactions: [transaction] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('Y')
  })
  it('returns "N" if payment type is credit and interface code is "cancelled" and a transaction of "Charge" and "Success" exists', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, paymentStatus: { interfaceCode: 'cancelled' }, transactions: [transaction] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('N')
  })
  it('returns "N" if payment type is credit and interface code is "paid" and a transaction of "Charge" and "Pending" exists', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, transactions: [{ ...transaction, state: 'Pending' }] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('N')
  })
  it('returns "N" if payment type is credit and interface code is "paid" and a transaction of "Authorization" and "Success" exists', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, transactions: [{ ...transaction, type: 'Authorization' }] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('N')
  })
  it('returns "Y" if payment type is credit and interface code is "paid" and a transaction of "Charge" and "Success" exists even if multiple transactions exist', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, transactions: [transaction, { ...transaction, state: 'Pending' }] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('Y')
  })
  it('returns "Y" if payment type is credit and interface code is "preauthed" and a transaction of "Authorization" and "Success" exists', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, paymentStatus: { interfaceCode: 'preauthed' }, transactions: [{ ...transaction, type: 'Authorization' }] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('Y')
  })
  it('returns "Y" if payment type is credit and interface code is "preauthed" and a transaction of "Authorization" and "Success" exists even if multiple transactions exist', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, paymentStatus: { interfaceCode: 'preauthed' }, transactions: [{ type: 'Authorization', state: 'Pending' },{ ...transaction, type: 'Authorization' }] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('Y')
  })
  it('returns "N" if payment type is credit and interface code is "preauthed" and a transaction of "Authorization" and "Pending" exists', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, paymentStatus: { interfaceCode: 'preauthed' }, transactions: [{ ...transaction, state: 'Pending' }] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('N')
  })
  it('returns "N" if payment type is credit and interface code is "preauthed" and a transaction of "Charge" and "Success" exists', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, paymentStatus: { interfaceCode: 'preauthed' }, transactions: [{ ...transaction, type: 'Charge' }] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('N')
  })
  it('returns "N" if payment type is credit and interface code is "cancelled" and a transaction of "Authorization" and "Success" exists', () => {
    const creditPaymentInfo = { ...paymentInfo, payments: [{ ...paymentInfo.payments[0], obj: { ...paymentInfo.payments[0].obj, paymentMethodInfo: { ...paymentInfo.payments[0].obj.paymentMethodInfo, method: 'credit' }, paymentStatus: { interfaceCode: 'cancelled' }, transactions: [transaction] } }] }
    expect(getPaymentReleasedStatus(creditPaymentInfo)).toBe('N')
  })
})

describe('getFirstLastName', () => {
  const shippingAddress = {
    streetName: '55 Fake St',
    postalCode: 'M4V 1H6',
    city: 'Toronto',
    state: 'ON',
    country: 'CA',
    phone: '5551231234',
    email: 'user@gmail.com',
    key: '9ee04fc1-17a5-4a83-9416-5cde81258c97'
  }
  const billingAddress = {
    streetName: '55 Fake St',
    postalCode: 'M4V 1H6',
    city: 'Toronto',
    state: 'ON',
    country: 'CA',
    phone: '5551231234',
    email: 'user@gmail.com',
    key: '9ee04fc1-17a5-4a83-9416-5cde81258c97'
  }

  it('returns billing address first name and last name when present', () => {
    const billingAddressWithNames = { ...billingAddress, firstName: 'firstName', lastName: 'lastName' }
    expect(getFirstLastName(billingAddressWithNames, shippingAddress, false)).toEqual({
      firstName: 'firstName',
      lastName: 'lastName'
    })
  })
  it('returns billing address first name and last name when present even if order is pickup in store', () => {
    const billingAddressWithNames = { ...billingAddress, firstName: 'firstName', lastName: 'lastName' }
    expect(getFirstLastName(billingAddressWithNames, shippingAddress, true)).toEqual({
      firstName: 'firstName',
      lastName: 'lastName'
    })
  })
  it('throws an error when billing address first/last name is not present even if order is pickup in store', () => {
    expect(() => getFirstLastName(billingAddress, shippingAddress, true)).toThrow('Missing firstname/lastname on order')
  })
  it('throws an error when billing address first/last name is not present', () => {
    expect(() => getFirstLastName(billingAddress, shippingAddress, false)).toThrow('Missing firstname/lastname on order')
  })
  it('returns billing address first name and last name when they are present on shipping address only if the order is pickup in store', () => {
    const billingAddressWithNames = { ...billingAddress, firstName: 'firstName', lastName: 'lastName' }
    expect(getFirstLastName(billingAddressWithNames, shippingAddress, true)).toEqual({
      firstName: 'firstName',
      lastName: 'lastName'
    })
  })
  it('throws an error when billing address first name and last name are present but the order is not pickup in store', () => {
    const billingAddressWithNames = { ...billingAddress, firstName: 'firstName', lastName: 'lastName' }
    expect(() => getFirstLastName(shippingAddress, billingAddressWithNames, false)).toThrow('Missing firstname/lastname on order')
  })
  it('returns shipping first/last name for pickup in store if they are present instead of billing address', () => {
    const billingAddressWithNames = { ...billingAddress, firstName: 'firstName', lastName: 'lastName' }
    const shippingAddressWithNames = { ...shippingAddress, firstName: 'firstName2', lastName: 'lastName2' }
    expect(getFirstLastName(shippingAddressWithNames, billingAddressWithNames, true)).toEqual({
      firstName: 'firstName2',
      lastName: 'lastName2'
    })
  })
})


describe('lineItemIsEndlessAisle', () => {
  it('returns true when given a line item with an endless aisle flag set to true', () => {
    const endlessAisleLineItem = {
      variant: {
        attributes: [{
          name: 'isEndlessAisle',
          value: true
        }]
      }
    }

    // @ts-ignore incomplete line item for testing
    expect(lineItemIsEndlessAisle(endlessAisleLineItem)).toBe(true)
  })

  it('returns false when given a line item with an endless aisle flag set to false', () => {
    const notEndlessAisleLineItem = {
      variant: {
        attributes: [{
          name: 'isEndlessAisle',
          value: false
        }]
      }
    }

    // @ts-ignore incomplete line item for testing
    expect(lineItemIsEndlessAisle(notEndlessAisleLineItem)).toBe(false)
  })

  it('returns false when given a line item with no endless aisle flag', () => {
    const notEndlessAisleLineItem = {
      variant: {
        attributes: []
      }
    }

    // @ts-ignore incomplete line item for testing
    expect(lineItemIsEndlessAisle(notEndlessAisleLineItem)).toBe(false)
  })
})
