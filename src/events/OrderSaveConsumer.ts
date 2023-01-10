import { ConsumerConfig, ConsumerRunConfig } from 'kafkajs'
import retry from 'async-retry'
import BaseConsumer from './BaseConsumer'
import { OrderSaveMessage } from './OrderSaveMessage'
import {
  ORDER_SAVE_CONCURRENT_PARTITIONS,
  ORDER_SAVE_MAX_BYTES,
  ORDER_SAVE_MAX_BYTES_PER_PARTITION,
  KAFKA_ORDER_SAVE_CONSUMER_GROUP_ID,
  KAFKA_ORDER_SAVE_TOPIC,
} from '../config'
import { processOrderSaveMessage } from '../commercetools/processOrderSaveMessage'
import { serializeError } from '../logger'
import OrderSaveDLQProducer from './OrderSaveDLQProducer'

export default class OrderSaveConsumer extends BaseConsumer<OrderSaveMessage> {
  topic = KAFKA_ORDER_SAVE_TOPIC
  consumerGroupId = KAFKA_ORDER_SAVE_CONSUMER_GROUP_ID

  dlqProducer?: OrderSaveDLQProducer

  protected consumerConfig: Partial<ConsumerConfig> = {
    maxBytesPerPartition: ORDER_SAVE_MAX_BYTES_PER_PARTITION,
    maxBytes: ORDER_SAVE_MAX_BYTES,
  }

  protected consumerRunConfig: ConsumerRunConfig = {
    partitionsConsumedConcurrently: ORDER_SAVE_CONCURRENT_PARTITIONS,
    // eachBatchAutoResolve: false, // Default value eachBatchAutoResolve is true
  }

  async onStart() {
    this.dlqProducer = new OrderSaveDLQProducer(this.kafkaClient, this.logger)
    this.dlqProducer.connect()
  }

  async onMessage(msg: OrderSaveMessage): Promise<void> {
    try {
      await retry(
        async (bail) => {
          // Retries are skipped if message is not valid.
          if (!validateMessage(bail, msg)) {
            return
          }

          await processOrderSaveMessage(msg)
        },
        { retries: 5 }
      )
    } catch (error) {
      this.logger.error({
        type: 'message_process_failed',
        error: serializeError(error),
        msg,
      })

      // Send to DLQ
      await this.dlqProducer?.send(msg)
    }
  }
}

const validateMessage = (bail: (e: Error) => void, message: any) => {
  if (!message.MESSAGE_KEY) {
    return bail(new Error('Message has no MESSAGE_KEY property'))
  }

  if (!message.ORDER_NUMBER) {
    return bail(new Error('Message has no ORDER_NUMBER property'))
  }

  if (!message.ACTIONS) {
    return bail(new Error('Message has no ACTIONS property'))
  }

  return true
}
