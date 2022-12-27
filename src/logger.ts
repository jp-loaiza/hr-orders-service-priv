import { createLogger, format, transports } from 'winston'
import { LOG_FORMAT, LOG_LEVEL } from './config'

const logger = createLogger({
  level: LOG_LEVEL,
  exitOnError: true,
  format: format[LOG_FORMAT](),
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
