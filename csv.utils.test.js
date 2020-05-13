const { convertToDollars, formatDate } = require('./csv.utils')

describe('convertToDollars', () => {
  it('works when the resulting dollar amount is an integer', () => {
    expect(convertToDollars(100)).toBe(1)
    expect(convertToDollars(700)).toBe(7)
  })

  it('rounds to two decimal places', () => {
    const veryPreciseCents = 123.001
    expect(convertToDollars(veryPreciseCents)).toBe(1.23)
  })

  it('rounds up when given 100.5 cents', () => {
    expect(convertToDollars(100.5)).toBe(1.01)
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
