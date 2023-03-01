import { MessageSetEntry, RecordBatchEntry } from 'kafkajs'
import { Order, OrderStateTransitionMessage } from '@commercetools/platform-sdk'
import { Custom } from '../orders'

export type MessageType = {
  MESSAGE_KEY: string
  LASTMODIFIEDDATE: number
}

export type ParsedMessage<T> = {
  key?: string
  kafkaMessage: MessageSetEntry | RecordBatchEntry
  parsedMessage: T
}

export type Logger = {
  info: (msg: any) => void
  error: (msg: any) => void
}

export type HeartBeatPayload = {
  /**
   * The number of milliseconds since the last heartbeat.
   * This can be helpful when creating rate or gauge stats.
   */
  deltaTime: number
}

export type HeartBeat = ({ deltaTime }: HeartBeatPayload) => Promise<void>

export type OrderProcessMessage = MessageType & OrderStateTransitionMessage & Custom & Order
