import { KAFKA_ORDER_SAVE_DLQ_TOPIC } from '../config'
import BaseProducer from './BaseProducer'
import { OrderSaveMessage } from './OrderSaveMessage'

export default class OrderSaveDLQProducer extends BaseProducer<OrderSaveMessage> {
  topic = KAFKA_ORDER_SAVE_DLQ_TOPIC
}
