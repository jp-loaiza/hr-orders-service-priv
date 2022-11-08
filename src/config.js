const envProperties= (/** @type {import('./orders').Env} */ (process.env))

const sftpConfig = {
  host: envProperties.SFTP_HOST,
  port: Number(envProperties.SFTP_PORT),
  username: envProperties.SFTP_USERNAME,
  privateKey: Buffer.from(envProperties.SFTP_PRIVATE_KEY, 'base64')
}

/**
 * Disable the creation of the statsd client. This is mostly used for local development.
 */
const STATS_DISABLE = envProperties.STATS_DISABLE === 'true' ? true: false

/**
  * Enabling UDS protocol. Fallsback to UDP.
  *
  * Default (true)
  */
const STATS_UDS_PROTOCOL_ENABLED = envProperties.STATS_UDS_PROTOCOL_ENABLED == 'true' ? true : false
 
const LOG_FORMAT_TYPE = envProperties.LOG_FORMAT === 'simple' ? 'simple' : 'json'

const ALGOLIA_APP_ID =envProperties.ALGOLIA_APP_ID;

const  ALGOLIA_API_KEY = envProperties.ALGOLIA_API_KEY;

const DYNAMIC_YIELD_API_KEY_SERVER= envProperties.DYNAMIC_YIELD_API_KEY_SERVER;

module.exports = {
  sftpConfig,
  ALGOLIA_APP_ID,
  ALGOLIA_API_KEY,
  DYNAMIC_YIELD_API_KEY_SERVER,
  STATS_DISABLE,
  STATS_UDS_PROTOCOL_ENABLED,
  LOG_FORMAT_TYPE
}
