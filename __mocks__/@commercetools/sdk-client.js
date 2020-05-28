const mockOrder = {
  id: '1',
  orderNumber: 'mockOrder',
  version: 1,
}

const ctMockResponse = {
  results: [mockOrder],
}

const mockClient = {
  execute: () => Promise.resolve({ body: ctMockResponse })
}

const sdkClient = {
  createClient: () => mockClient
}

module.exports = sdkClient
