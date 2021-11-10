const { getJestaApiResponseState } = require('./jesta.utils')
const { sendOrderUpdateToJesta } = require('./jesta')
const { fetchWithTimeout } = require('./request.utils')

jest.mock('./jesta.utils')
jest.mock('./request.utils')

describe('sendOrderUpdateToJesta', () => {
  // @ts-ignore
  fetchWithTimeout.mockResolvedValue({})

  it('returns the response from Jesta if its state is "success"', async () => {
    // @ts-ignore
    getJestaApiResponseState.mockReturnValueOnce('success')
    const response = await sendOrderUpdateToJesta('orderNumber', 'orderStatus', 'cartSourceWebsite')
    expect(response).toEqual({})
  })

  it('returns the response from Jesta if its state is "warning"', async () => {
    // @ts-ignore
    getJestaApiResponseState.mockReturnValueOnce('warning')
    const response = await sendOrderUpdateToJesta('orderNumber', 'orderStatus', 'cartSourceWebsite')
    expect(response).toEqual({})
  })

  it('throws an error if the state of the response from Jesta is "failure"', async () => {
    // @ts-ignore
    getJestaApiResponseState.mockReturnValueOnce('failure')
    return expect(sendOrderUpdateToJesta('orderNumber', 'orderStatus','cartSourceWebsite')).rejects.toEqual(new Error('Invalid or failure Jesta response: {}'))
  })
})
