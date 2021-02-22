const { getJestaApiResponseState } = require('./jesta')

describe('getJestaApiResponseState', () => {
  it('returns "failure" when given anything that is not an object', () => {
    const nonObjectResponses = [null, undefined, 0, 1, 'ok', '']

    for (const response of nonObjectResponses) {
      // @ts-ignore calling with arguments of unexpected type for testing
      expect(getJestaApiResponseState(response)).toBe('failure')
    }
  })

  it('returns "failure" when given an object that lacks a return code', () => {
    const incompleteResponses = [
      { ReturnMessage: 'Success.' },
      { ReturnMessage: null },
      {},
    ]

    for (const response of incompleteResponses) {
      // @ts-ignore calling with arguments of unexpected type for testing
      expect(getJestaApiResponseState(response)).toBe('failure')
    }
  })

  it('returns "failure" when given an object that has an unrecognized return code', () => {
    const unrecognizedReturnCode = 203
    expect(getJestaApiResponseState({ ReturnCode: unrecognizedReturnCode })).toBe('failure')
  })

  it('returns "success" when given an object that has a Jesta return code which indicates that we should neither retry sending the order nor log a warning to the console', () => {
    const successResponses = [
      {
        ReturnCode: 1,
        ReturnMessage: 'Success.'
      },
      {
        ReturnCode: 104,
        ReturnMessage: 'Cancellation has been aborted - Order is already cancelled.'
      },
      {
        ReturnCode: 202,
        ReturnMessage: 'Release order has been aborted - order is already released.'
      }
    ]

    for (const response of successResponses) {
      expect(getJestaApiResponseState(response)).toBe('success')
    }
  })

  it('returns "failure" when given an object that a Jesta return code which indicates that we must retry sending the order', () => {
    const failureResponses = [
      {
        ReturnCode: 2,
        ReturnMessage: 'Order does not exist.'
      },
      {
        ReturnCode: 99,
        ResponseMessage: 'Action failure - Unexpected database error, please contact support.'
      }
    ]

    for (const response of failureResponses) {
      expect(getJestaApiResponseState(response)).toBe('failure')
    }
  })

  it('returns "warning" when given an object that has a Jesta return code which indicates that we should not retry sending the order but we should log a warning to the console', () => {
    const warningResponses = [
      {
        ReturnCode: 101,
        ReturnMessage: 'Cancellation has been aborted - Reason code is required.'
      },
      {
        ReturnCode: 102,
        ReturnMessage: 'Cancellation has been aborted - Reason code is invalid.'
      },
      {
        ReturnCode: 103,
        ReturnMessage: 'Cancellation has been aborted - Order is complete (shipped, pickup, or picked up).'
      },
      {
        ReturnCode: 201,
        ReturnMessage: 'Release order has been aborted - order status is not open, hold, or in picking.'
      }
    ]

    for (const response of warningResponses) {
      expect(getJestaApiResponseState(response)).toBe('warning')
    }
  })
})
