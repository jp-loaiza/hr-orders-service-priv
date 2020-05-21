// @ts-nocheck The linter gets confused by Jest mocks

const { generateFilenameFromOrder, createAndUploadCsvs } = require('./server.utils')
const { setOrderAsSentToOms, setOrderErrorMessage } = require('./commercetools')

jest.mock('./config')
jest.mock('./commercetools')

describe('generateFilenameFromOrder', () => {
  const mockOrder1 = {
    createdAt: '2020-05-05T20:54:07.503Z',
    orderNumber: '12345'
  }

  const mockOrder2 = {
    createdAt: '2020-01-01T01:04:17.503Z',
    orderNumber: '00001'
  }

  it('returns the correct filename', () => {
    expect(generateFilenameFromOrder(mockOrder1)).toBe('Orders-2020-05-05-205407-12345.csv')
    expect(generateFilenameFromOrder(mockOrder2)).toBe('Orders-2020-01-01-010417-00001.csv')
  })
})

describe('createAndUploadCsvs', () => {
  afterEach(() => {
    setOrderErrorMessage.mockClear()
    setOrderAsSentToOms.mockClear()
  })

  // Each time `createAndUploadCsvs` is called called, different mock orders
  // get fed into it, as indicated in the test description. See `/__mocks__/commercetools.js`
  // for details.
  it('processes [validOrder, invalidOrder] correctly', async () => {
    await createAndUploadCsvs()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorMessage.mock.calls.length).toBe(1)
  })

  it('processes [invalidOrder, validOrder] correctly', async () => {
    await createAndUploadCsvs()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorMessage.mock.calls.length).toBe(1)
  })

  it('processes [validOrder] correctly', async () => {
    await createAndUploadCsvs()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorMessage.mock.calls.length).toBe(0)
  })

  it('processes [] correctly', async () => {
    await createAndUploadCsvs()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(0)
    expect(setOrderErrorMessage.mock.calls.length).toBe(0)
  })
})
