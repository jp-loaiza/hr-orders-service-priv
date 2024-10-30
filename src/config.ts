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

export const SFTP_INCOMING_ORDERS_PATH = envProperties.SFTP_INCOMING_ORDERS_PATH ?? './EDOM/pending/'

export const NOTIFICATIONS_BEARER_TOKEN = envProperties.NOTIFICATIONS_BEARER_TOKEN

export const shouldUploadOrders = envProperties.SHOULD_UPLOAD_ORDERS === 'true'

export const shouldSendNotifications = envProperties.SHOULD_SEND_NOTIFICATIONS === 'true'

export const shouldCheckForStuckOrders = envProperties.SHOULD_CHECK_FOR_STUCK_ORDERS === 'true'

export const shouldCheckForFullGiftCardOrders = envProperties.SHOULD_CHECK_FOR_FULL_GIFT_CARD_ORDERS === 'true' 

export const shouldSendOrderUpdates = envProperties.SHOULD_SEND_ORDER_UPDATES === 'true'

export const shouldSendAlgoliaInfo = envProperties.SHOULD_SEND_ALGOLIA_INFO === 'true'

export const shouldSendDynamicYieldInfo = envProperties.SHOULD_SEND_DYNAMIC_YIELD_INFO === 'true'

export const shouldSendOrderNarvar = envProperties.SHOULD_SEND_NARVAR_ORDERS === 'true'

export const shouldSendOrdersStatusPendingToLogs = envProperties.SHOULD_SEND_REPORT_FROM_ORDERS_SENT_TO_NARVAR === 'true'

export const shouldSendCjConversions = envProperties.SHOULD_SEND_CJ_CONVERSIONS === 'true'

export const shouldSendOrderSegment = envProperties.SHOULD_SEND_SEGMENT_ORDERS === 'true'
/**
 * Kafka connection credentials
 */
export const DEBUG = envProperties.DEBUG === 'true' ?? false
export const KAFKA_BROKERS = envProperties.KAFKA_BROKERS ?? ''
export const KAFKA_USERNAME = envProperties.KAFKA_USERNAME ?? ''
export const KAFKA_PASSWORD = envProperties.KAFKA_PASSWORD ?? ''
export const KAFKA_SSL_CA = process.env.KAFKA_SSL_CA
export const KAFKA_SSL_CERT = process.env.KAFKA_SSL_CERT
export const KAFKA_SASL_MECHANISM = (process.env.KAFKA_SASL_MECHANISM as 'plain' | 'scram-sha-512') ?? 'plain'
export const KAFKA_CLIENT_ID = envProperties.KAFKA_CLIENT_ID ?? 'hr-order-service'
export const KAFKA_ORDER_SAVE_TOPIC = envProperties.KAFKA_ORDER_SAVE_TOPIC ?? 'commercetools-order-save'
export const KAFKA_ORDER_SAVE_CONSUMER_GROUP_ID = envProperties.KAFKA_ORDER_SAVE_CONSUMER_GROUP_ID ?? 'hr-order-save'
export const KAFKA_ORDER_SAVE_DLQ_TOPIC = envProperties.KAFKA_ORDER_SAVE_DLQ_TOPIC ?? 'hr-order-save-dlq'
export const ORDER_SAVE_MAX_BYTES_PER_PARTITION = parseInt(envProperties.ORDER_SAVE_MAX_BYTES_PER_PARTITION ?? '1048576')
export const ORDER_SAVE_MAX_BYTES = parseInt(envProperties.ORDER_SAVE_MAX_BYTES ?? '10485760')
export const ORDER_SAVE_CONCURRENT_PARTITIONS = parseInt(envProperties.ORDER_SAVE_CONCURRENT_PARTITIONS ?? '1')
export const DISABLE_ORDER_SAVE_ACTOR = envProperties.DISABLE_ORDER_SAVE_ACTOR ?? true
export const RECEIVE_NARVAR_DELIVERED_EVENTS = envProperties.RECEIVE_NARVAR_DELIVERED_EVENTS === 'true' ?? false

export const HR_COMMERCE_TOPIC = envProperties.HR_COMMERCE_TOPIC ?? 'commercetools-messages'
export const KAFKA_ORDER_PROCESS_CONSUMER_GROUP_ID = envProperties.KAFKA_ORDER_PROCESS_CONSUMER_GROUP_ID ?? 'commercetools-order-process-consumer-group-id'
export const ORDER_PROCESS_MAX_BYTES_PER_PARTITION = parseInt(envProperties.ORDER_PROCESS_MAX_BYTES_PER_PARTITION ?? '1048576')
export const ORDER_PROCESS_MAX_BYTES = parseInt(envProperties.ORDER_PROCESS_MAX_BYTES ?? '1048576')
export const ORDER_PROCESS_CONCURRENT_PARTITIONS = parseInt(process.env.ORDER_PROCESS_CONCURRENT_PARTITIONS ?? '3')
export const PROCESS_ORDER_EVENTS = envProperties.PROCESS_ORDER_EVENTS === 'true' ?? false

export const EMAIL_API_URL = envProperties.EMAIL_API_URL
export const EMAIL_API_USERNAME = envProperties.EMAIL_API_USERNAME
export const EMAIL_API_PASSWORD = envProperties.EMAIL_API_PASSWORD

export const CREATE_UPLOAD_CSV_EVENT = envProperties.CREATE_UPLOAD_CSV_EVENT === 'true' ?? false
export const ORDER_UPDATE_EVENT = envProperties.ORDER_UPDATE_EVENT === 'true' ?? false
export const EMAIL_NOTIFY_CRM_EVENT = envProperties.EMAIL_NOTIFY_CRM_EVENT === 'true' ?? false
export const ALGOLIA_CONVERSIONS_EVENT = envProperties.ALGOLIA_CONVERSIONS_EVENT === 'true' ?? false
export const PURCHASE_EVENTS_DY_EVENT = envProperties.PURCHASE_EVENTS_DY_EVENT === 'true' ?? false
export const NARVAR_ORDER_EVENT = envProperties.NARVAR_ORDER_EVENT === 'true' ?? false
export const SEGMENT_ORDER_EVENT = envProperties.SEGMENT_ORDER_EVENT === 'true' ?? false
export const ORDER_CONVERSION_TO_CJ_EVENT = envProperties.ORDER_CONVERSION_TO_CJ_EVENT === 'true' ?? false
export const STUCK_ORDER_EVENT = envProperties.STUCK_ORDER_EVENT === 'true' ?? false

export const ENABLE_CANADA_POST_CARRIER = envProperties.ENABLE_CANADA_POST_CARRIER === 'true' ?? false