import { Kafka, logLevel } from 'kafkajs'
import { KAFKA_BROKERS, KAFKA_CLIENT_ID, DEBUG, KAFKA_PASSWORD, KAFKA_USERNAME } from '../config'

const brokers = KAFKA_BROKERS.split(',')

const kafkaClient = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers,
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: KAFKA_USERNAME,
    password: KAFKA_PASSWORD,
  },
  logLevel: DEBUG ? logLevel.INFO : logLevel.ERROR,
})

export default kafkaClient
