const { SFTP_HOST, SFTP_PORT, SFTP_USERNAME, SFTP_PRIVATE_KEY, ALGOLIA_APP_ID, ALGOLIA_API_KEY, DYNAMIC_YIELD_API_KEY_SERVER } = (/** @type {import('./orders').Env} */ (process.env))

const sftpConfig = {
  host: SFTP_HOST,
  port: Number(SFTP_PORT),
  username: SFTP_USERNAME,
  privateKey: Buffer.from(SFTP_PRIVATE_KEY, 'base64')
}

module.exports = {
  sftpConfig,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  DYNAMIC_YIELD_API_KEY_SERVER
}
