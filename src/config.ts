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

/**
 * Kafka connection credentials
 */
export const DEBUG = envProperties.DEBUG === 'true' ?? false
export const KAFKA_BROKERS = envProperties.KAFKA_BROKERS ?? ''
export const KAFKA_USERNAME = envProperties.KAFKA_USERNAME ?? ''
export const KAFKA_PASSWORD = envProperties.KAFKA_PASSWORD ?? ''
export const KAFKA_CLIENT_ID = envProperties.KAFKA_CLIENT_ID ?? 'hr-order-service'
export const KAFKA_ORDER_SAVE_TOPIC = envProperties.KAFKA_ORDER_SAVE_TOPIC ?? 'commercetools-order-save'
export const KAFKA_ORDER_SAVE_CONSUMER_GROUP_ID = envProperties.KAFKA_ORDER_SAVE_CONSUMER_GROUP_ID ?? 'hr-order-save'
export const KAFKA_ORDER_SAVE_DLQ_TOPIC = envProperties.KAFKA_ORDER_SAVE_DLQ_TOPIC ?? 'hr-order-save-dlq'
export const ORDER_SAVE_MAX_BYTES_PER_PARTITION = parseInt(envProperties.ORDER_SAVE_MAX_BYTES_PER_PARTITION ?? '1048576')
export const ORDER_SAVE_MAX_BYTES = parseInt(envProperties.ORDER_SAVE_MAX_BYTES ?? '10485760')
export const ORDER_SAVE_CONCURRENT_PARTITIONS = parseInt(envProperties.ORDER_SAVE_CONCURRENT_PARTITIONS ?? '1')
export const DISABLE_ORDER_SAVE_ACTOR = envProperties.DISABLE_ORDER_SAVE_ACTOR ?? true
