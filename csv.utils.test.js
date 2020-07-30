const {
  convertToDollars,
  formatDate,
  formatCardExpiryDate,
  getCardReferenceNumberFromPayment,
  getLineOneFromAddress,
  getLineTaxDescriptionFromLineItem,
  getLineTotalTaxFromLineItem,
  getLineTwoFromAddress,
} = require('./csv.utils')

describe('convertToDollars', () => {
  it('works when the resulting dollar amount is an integer', () => {
    expect(convertToDollars(100)).toBe(1)
    expect(convertToDollars(700)).toBe(7)
  })

  it('returns 0 when given 0', () => {
    expect(convertToDollars(0)).toBe(0)
  })
})

describe('formatDate', () => {
  it('formats dates correctly ', () => {
    expect(formatDate('2020-05-13T13:33:21.290Z')).toBe('2020-05-13 13:33')
    expect(formatDate('2020-05-13T09:33:21.290Z')).toBe('2020-05-13 09:33')
  })
})

describe('formatCardExpiryDate', () => {
  it('formats dates correctly', () => {
    expect(formatCardExpiryDate('01-2020')).toEqual('0120')
    expect(formatCardExpiryDate('12-1939')).toEqual('1239')
  })
})

describe('getCardReferenceNumberFromPayment', () => {
  const payment = {
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
          transaction_card_type: 'visa'
        }
      }
    }
  }

  it('returns a string that is the first and last digits of the payment cart', () => {
    expect(getCardReferenceNumberFromPayment(payment)).toBe('19')
  })
})

const address = {
  streetName: 'Fake St.',
  streetNumber: '123',
  postalCode: 'A1B 2C3',
  apartment: '900',
  city: 'Toronto',
  state: 'ON',
  country: 'CA',
  firstName: 'First',
  lastName: 'Last',
  phone: '555-5555'
}
describe('getLineOneFromAddress', () => {
  it('returns the street number followed by the street name', () => {
    expect(getLineOneFromAddress(address)).toEqual('123 Fake St.')
  })
})

describe('getLineTwoFromAddress', () => {
  it('returns the street number followed by the street name', () => {
    expect(getLineTwoFromAddress(address)).toEqual('900')
  })
})


const incompleteLine = {
  custom: {
    fields: {
      itemTaxes: JSON.stringify({
        GST: '12',
        PST: '23'
      })
    }
  }
}

describe('getLineTotalTaxFromLineItem', () => {
  it('calculates taxes correctly', () => {
    // @ts-ignore incomplete line for testing only tax related things
    expect(getLineTotalTaxFromLineItem(incompleteLine)).toBe(35)
  })
})

describe('getLineTaxDescriptionFromLineItem', () => {
  it('returns the correct description', () => {
    // @ts-ignore incomplete line for testing only tax related things
    expect(getLineTaxDescriptionFromLineItem(incompleteLine)).toBe('GST')
  })
})
