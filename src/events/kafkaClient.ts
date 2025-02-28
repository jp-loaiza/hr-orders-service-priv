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

const brokers = KAFKA_BROKERS.split(',');

// Dynamically enable SSL only if using port 9093 (TLS listener)
const ssl: boolean | tls.ConnectionOptions = brokers.some(broker => broker.includes(':9093'))
  ? (KAFKA_SSL_CA
      ? {
          rejectUnauthorized: false,
          ca: KAFKA_SSL_CA,
          ...(KAFKA_SSL_CERT ? { cert: KAFKA_SSL_CERT } : {}), // Only include cert if available
        }
      : true) // Enable SSL with CA, but no client cert if not provided
  : false; // Ensure SSL is disabled for plain listener (port 9092)

const sasl: SASLOptions = {
  mechanism: KAFKA_SASL_MECHANISM,
  username: KAFKA_USERNAME,
  password: KAFKA_PASSWORD,
};

const kafkaClient = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers,
  ssl,
  sasl,
  logLevel: DEBUG ? logLevel.INFO : logLevel.ERROR,
});

export default kafkaClient;
