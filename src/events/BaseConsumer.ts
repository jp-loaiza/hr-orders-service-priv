import {
  ConnectEvent,
  Consumer,
  ConsumerCommitOffsetsEvent,
  ConsumerConfig,
  ConsumerCrashEvent,
  ConsumerEndBatchProcessEvent,
  ConsumerEvents,
  ConsumerFetchEvent,
  ConsumerFetchStartEvent,
  ConsumerGroupJoinEvent,
  ConsumerHeartbeatEvent,
  ConsumerRebalancingEvent,
  ConsumerReceivedUnsubcribedTopicsEvent,
  ConsumerRunConfig,
  ConsumerStartBatchProcessEvent,
  DisconnectEvent,
  EachBatchPayload,
  InstrumentationEvent,
  Kafka,
  KafkaMessage,
  RemoveInstrumentationEventListener,
  RequestEvent,
  RequestQueueSizeEvent,
  RequestTimeoutEvent,
  ValueOf,
} from 'kafkajs'
import { HeartBeat, Logger, MessageType, ParsedMessage } from './Types'

/**
 * BaseConsumer is extendable for each desired consumer implementation.
 * Subclasses need only define topic name, consumer group and a onMessage implementation.
 */
export default abstract class BaseConsumer<T extends MessageType> {
  private kafkaConsumer?: Consumer

  /**
   * The kafka topic this consumer should subscribe to.
   */
  abstract topic: string

  /**
   * The consumer group for this consumer. It's important that this is the
   * same for all consumers of each type.
   */
  abstract consumerGroupId: string

  /**
   * Allow subclasses to add config to bootstrap the consumer.
   */
  protected consumerConfig: Partial<ConsumerConfig> = {}

  /**
   * Allow subclasses to add config to this.kafkaConsumer.run().
   */
  protected consumerRunConfig: ConsumerRunConfig = {}

  /**
   * Timestamp of last submitted heartbeat to kafka.
   */
  protected lastHeartbeat?: number = undefined

  /**
   * Handles each individual message from the topic.
   *
   * @param message The message
   */
  abstract onMessage(message: T): void

  private lastConsumerHeartBeat?: number = undefined

  public constructor(protected kafkaClient: Kafka, protected logger: Logger) {}

  private createKafkaConsumer(kafkaClient: Kafka): Consumer {
    const consumer = kafkaClient.consumer({
      groupId: this.consumerGroupId,
      ...this.consumerConfig,
    })
    return consumer
  }

  /**
   * Based on the lastConsumerheartbeat it returns the consumer health status .
   * @returns consumer health
   */
  public async consumerHealth() {
    if (this.lastConsumerHeartBeat && new Date().getTime() - this.lastConsumerHeartBeat < 3000) {
      return true
    } else {
      return false
    }
  }

  public async startConsumer() {
    this.kafkaConsumer = this.kafkaConsumer ?? this.createKafkaConsumer(this.kafkaClient)
    this.logger.info(`starting consumer: ${this.consumerGroupId}`)

    this.onBatch = this.onBatch.bind(this)
    this.onStart = this.onStart.bind(this)

    try {
      await this.onStart()
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe({
        topic: this.topic,
        fromBeginning: true,
      })

      await this.kafkaConsumer.run({
        ...this.consumerRunConfig,
        eachBatch: this.onBatch,
      })

      this.on('consumer.crash', async (event: ConsumerCrashEvent) => {
        if (!event.payload.restart) {
          await this.startConsumer()
        }
      })
    } catch (error) {
      this.logger.error(error)
    }

    return this
  }

  /**
   * Gives implementations a chance to initialize.
   */
  async onStart() {}

  /**
   * Default onBatch implementation.
   */
  async onBatch({ batch: { messages }, isRunning, isStale, heartbeat }: EachBatchPayload) {
    for (const message of messages) {
      if (!isRunning() || isStale()) {
        break
      }

      const msg = this.parseMessage(message)
      await this.onMessage(msg.parsedMessage)

      await this.doHeartbeat(heartbeat)
    }
  }

  protected parseMessage(message: KafkaMessage) {
    return {
      key: message.key?.toString() ?? null,
      parsedMessage: message.value ? JSON.parse(message.value?.toString()) : null,
      kafkaMessage: message,
    } as ParsedMessage<T>
  }

  protected parseMessages(messages: KafkaMessage[]) {
    return messages.map((message) => this.parseMessage(message))
  }

  /**
   * Handles heartbeat for implementations which manage their own batches or
   * have long running processes. Prevents heartbeat from being called more
   * than once every 3 seconds. Provides the exact time since the last
   * heartbeat.
   */
  public async doHeartbeat(heartbeat: HeartBeat) {
    if (!this.lastHeartbeat) {
      this.lastHeartbeat = new Date().getTime()
    }

    const deltaTime = new Date().getTime() - this.lastHeartbeat
    if (deltaTime > 3000) {
      await heartbeat({ deltaTime })
      this.lastHeartbeat = this.lastHeartbeat + deltaTime
    }
  }

  /**
   * Reduce the batch of messages so we only have the latest of each message
   * for each message key. Messages without keys are not filtered.
   *
   * @param messages Unfiltered message batch
   * @returns Filtered messages.
   */
  public filterMessages(messages: ParsedMessage<T>[]): ParsedMessage<T>[] {
    return messages
      .reduceRight((carry: ParsedMessage<T>[], current: ParsedMessage<T>) => {
        if (!current.key || !carry.find((item) => item.key === current.key)) {
          carry.push(current)
          return carry
        }

        return carry
      }, [])
      .reverse()
  }

  public async disconnect() {
    if (this.kafkaConsumer) {
      this.logger.info(`stopping consumer: ${this.consumerGroupId}`)
    }

    await this.kafkaConsumer?.disconnect()
  }

  on(
    eventName: ConsumerEvents['HEARTBEAT'],
    listener: (event: ConsumerHeartbeatEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['COMMIT_OFFSETS'],
    listener: (event: ConsumerCommitOffsetsEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['GROUP_JOIN'],
    listener: (event: ConsumerGroupJoinEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['FETCH_START'],
    listener: (event: ConsumerFetchStartEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['FETCH'],
    listener: (event: ConsumerFetchEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['START_BATCH_PROCESS'],
    listener: (event: ConsumerStartBatchProcessEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['END_BATCH_PROCESS'],
    listener: (event: ConsumerEndBatchProcessEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['CONNECT'],
    listener: (event: ConnectEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['DISCONNECT'],
    listener: (event: DisconnectEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['STOP'],
    listener: (event: InstrumentationEvent<null>) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['CRASH'],
    listener: (event: ConsumerCrashEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['REBALANCING'],
    listener: (event: ConsumerRebalancingEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['RECEIVED_UNSUBSCRIBED_TOPICS'],
    listener: (event: ConsumerReceivedUnsubcribedTopicsEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['REQUEST'],
    listener: (event: RequestEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['REQUEST_TIMEOUT'],
    listener: (event: RequestTimeoutEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  on(
    eventName: ConsumerEvents['REQUEST_QUEUE_SIZE'],
    listener: (event: RequestQueueSizeEvent) => void
  ): RemoveInstrumentationEventListener<typeof eventName>
  public on(
    eventName: ValueOf<ConsumerEvents>,
    listener: (event: InstrumentationEvent<any>) => void
  ): RemoveInstrumentationEventListener<typeof eventName> {
    if (!this.kafkaConsumer) {
      throw new Error('No consumer initialized')
    }

    return this.kafkaConsumer?.on(eventName, listener)
  }
}
