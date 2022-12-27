const envProperties = (/** @type {import('./orders').Env} */ (process.env))

export const sftpConfig = {
  host: envProperties.SFTP_HOST,
  port: Number(envProperties.SFTP_PORT),
  username: envProperties.SFTP_USERNAME,
  privateKey: Buffer.from(envProperties.SFTP_PRIVATE_KEY as string, 'base64')
}

/**
 * Disable the creation of the statsd client. This is mostly used for local development.
 */
export const STATS_DISABLE = envProperties.STATS_DISABLE ?? false

/**
  * Enabling UDS protocol. Fallsback to UDP.
  *
  * Default (true)
  */
export const STATS_UDS_PROTOCOL_ENABLED = envProperties.STATS_UDS_PROTOCOL_ENABLED == 'true' ?? false

export const LOG_FORMAT = envProperties.LOG_FORMAT === 'simple' ? 'simple' : 'json'

export const ALGOLIA_APP_ID = envProperties.ALGOLIA_APP_ID;

export const ALGOLIA_API_KEY = envProperties.ALGOLIA_API_KEY;

export const DYNAMIC_YIELD_API_KEY_SERVER = envProperties.DYNAMIC_YIELD_API_KEY_SERVER;

export const LOG_LEVEL = envProperties.LOG_LEVEL
