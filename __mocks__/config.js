const mockSftpConfig = {
  host: 'mockHost',
  port: 7357,
  username: 'mockUser',
  privateKey: 'mockKey'
}

const testFn = jest.fn(() => console.log('yo'))

module.exports = {
  sftpConfig: mockSftpConfig,
  testFn
}
