import { Kafka, logLevel, SASLOptions } from 'kafkajs'
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID,
  DEBUG,
  KAFKA_PASSWORD,
  KAFKA_USERNAME,
  KAFKA_SSL_CA,
  KAFKA_SSL_CERT,
  KAFKA_SASL_MECHANISM,
} from '../config'
import * as tls from 'tls'

const brokers = KAFKA_BROKERS.split(',')

const ssl: true | tls.ConnectionOptions =
  KAFKA_SSL_CA && KAFKA_SSL_CERT
    ? {
        rejectUnauthorized: false,
        ca: KAFKA_SSL_CA,
        cert: KAFKA_SSL_CERT,
      }
    : true

const sasl: SASLOptions = {
  mechanism: KAFKA_SASL_MECHANISM,
  username: KAFKA_USERNAME,
  password: KAFKA_PASSWORD
}

const kafkaClient = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers,
  ssl,
  sasl,
  logLevel: DEBUG ? logLevel.INFO : logLevel.ERROR,
})

export default kafkaClient
