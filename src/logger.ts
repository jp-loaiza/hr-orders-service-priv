import { createLogger, format, transports } from 'winston'
import { LOG_FORMAT_TYPE, LOG_LEVEL } from './config'

const logFormat = LOG_FORMAT_TYPE === 'simple' ? format.simple() : format.json();

const logger = createLogger({
  level: LOG_LEVEL,
  exitOnError: true,
  format: logFormat,
  transports: [new transports.Console({ handleExceptions: true })],
})

export const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }
  return error
}

export default logger
