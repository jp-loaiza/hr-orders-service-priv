const { createLogger, format, transports } = require( 'winston')
const { LOG_FORMAT_TYPE } = require( './config')

const logFormat = LOG_FORMAT_TYPE=== 'simple' ? format.simple():format.json();

const logger = createLogger({
  level: 'info',
  exitOnError: true,
  format: logFormat,
  transports: [new transports.Console({ handleExceptions: true })],
})

module.exports = { logger}
