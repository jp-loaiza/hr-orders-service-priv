const { getNextRetryDateFromRetryCount } = require('./commercetools')
const { BACKOFF } = require('./constants')

describe('getNextRetryDateFromRetryCount', () => {
  it('returns a date object', () => {
    expect(getNextRetryDateFromRetryCount(0) instanceof Date).toBe(true)
  })

  it('returns the correct date when retry count is 0', () => {
    const now = new Date().valueOf()
    const expectedMs = now + Math.pow(2, 0) * BACKOFF
    expect(getNextRetryDateFromRetryCount(0).valueOf()).toBe(expectedMs)
  })

  it('returns the correct date when retry count is 5', () => {
    const now = new Date().valueOf()
    const expectedMs = now + Math.pow(2, 5) * BACKOFF
    expect(getNextRetryDateFromRetryCount(5).valueOf()).toBe(expectedMs)
  })
})
