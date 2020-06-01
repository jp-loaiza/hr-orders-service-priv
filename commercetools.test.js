const { getActionsFromCustomFields, getNextRetryDateFromRetryCount } = require('./commercetools')
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

describe('getActionsFromCustomFields', () => {
  it('returns an empty array when given an empty object', () => {
    expect(getActionsFromCustomFields({})).toEqual([])
  })

  it('returns an action to set a field when given an object with a non-nullish value', () => {
    const expected = [{
      action: 'setCustomField',
      name: 'foo',
      value: 1
    }]

    expect(getActionsFromCustomFields({ foo: 1 })).toEqual(expected)
  })

  it('returns an action to remove a field when given an object with a nullish value', () => {
    const expected = [{
      action: 'setCustomField',
      name: 'foo'
    }]

    expect(getActionsFromCustomFields({ foo: null })).toEqual(expected)
    expect(getActionsFromCustomFields({ foo: undefined })).toEqual(expected)
  })

  it('returns multiple update actions when given an object with many values', () => {
    const expected = [
      {
        action: 'setCustomField',
        name: 'foo',
        value: 1
      },
      {
        action: 'setCustomField',
        name: 'bar',
        value: 'value'
      },
      {
        action: 'setCustomField',
        name: 'baz'
      }
    ]

    expect(getActionsFromCustomFields({ foo: 1, bar: 'value', baz: null })).toEqual(expected)
  })
})
