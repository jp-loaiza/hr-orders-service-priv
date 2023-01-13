import { KAFKA_ORDER_SAVE_TOPIC } from '../config'
import BaseProducer from './BaseProducer'
import { OrderSaveMessage } from './OrderSaveMessage'

export default class InventoryEntryDLQProducer extends BaseProducer<OrderSaveMessage> {
  topic = KAFKA_ORDER_SAVE_TOPIC
}
