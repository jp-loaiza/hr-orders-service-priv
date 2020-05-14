const { generateFilenameFromOrder } = require('./server.utils')

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
    // @ts-ignore mock order is incomplete
    expect(generateFilenameFromOrder(mockOrder1)).toBe('Orders-2020-05-05-205407-12345.csv')
    // @ts-ignore mock order is incomplete
    expect(generateFilenameFromOrder(mockOrder2)).toBe('Orders-2020-01-01-010417-00001.csv')
  })
})
