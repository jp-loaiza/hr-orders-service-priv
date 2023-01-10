import { Kafka, Message, Producer } from 'kafkajs'
import { Logger, MessageType } from './Types'

export default abstract class BaseProducer<T extends MessageType> {
  private kafkaProducer?: Producer

  /**
   * The kafka topic this producer should send to.
   */
  abstract topic: string

  protected queue: Message[] = []

  protected options: { flushBatchSize: number } = {
    flushBatchSize: 100,
  }

  public constructor(protected kafkaClient: Kafka, protected logger: Logger) {}

  public async connect() {
    this.kafkaProducer = this.kafkaProducer ?? this.kafkaClient.producer()
    await this.kafkaProducer.connect()
  }

  public async send(msg: T, key?: string) {
    this.queue.push({ key, value: JSON.stringify(msg) })

    if (this.queue.length % this.options.flushBatchSize === 0) {
      await this.flush()
    }
  }

  public async flush() {
    if (!this.queue.length) {
      return
    }

    if (!this.kafkaProducer) {
      throw new Error('Cannot send messages while unconnected')
    }

    // The queue can be populated during the sending of messages so make sure
    // to copy and empty the queue before the request starts.
    const messages = this.queue
    this.queue = []

    this.logger.info({
      type: 'kafka_producer_flush',
      topic: this.topic,
      message_count: messages.length,
    })

    const response = await this.kafkaProducer.send({
      topic: this.topic,
      messages,
    })

    return response
  }
}
