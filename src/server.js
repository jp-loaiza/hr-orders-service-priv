require('dotenv').config()
require('newrelic')

const express = require('express')
const bodyParser = require('body-parser')
const client = require('ssh2-sftp-client')

require('./jobs/jobs')
const { sftpConfig, DISABLE_ORDER_SAVE_ACTOR } = require('./config')
const { keepAliveRequest } = require('./commercetools/commercetools')
const { sendOrderEmailNotificationByOrderId } = require('./emails/email')
const { getEnabledJobsLastExecutionTime, jobTotalTimeout } = require('./jobs/jobs')
const { default: logger, serializeError } = require('./logger')

const { SFTP_INCOMING_ORDERS_PATH, NOTIFICATIONS_BEARER_TOKEN } = (/** @type {import('./orders').Env} */ (process.env))
const { default: kafkaClient } = require('./events/kafkaClient')
const { default: OrderSaveConsumer } = require('./events/OrderSaveConsumer')

const app = express()
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json())
// remove x-powered-by header
app.disable('x-powered-by')

/**
 * @param {Express.Response} res 
 */
async function checkServicesHealth(res) {
  try {
    const sftp = new client()
    logger.info('Initiating health check...')
    await sftp.connect(sftpConfig)
    await Promise.all([
      keepAliveRequest(),
      sftp.list(SFTP_INCOMING_ORDERS_PATH)
    ])
    sftp.end()
    console.log('Health check successful.')
    res.status(200).send('ok')
  } catch (error) {
    const message = 'Health check failed:'
    if (error.body && Array.isArray(error.body.errors)) {
      console.error(message)
      error.body.errors.forEach(console.error)
    } else {
      logger.error({
        type: 'health_check_failure',
        message: message,
        error: serializeError(error)
      })
    }
    res.status(500).send('failed')
  }
}

/**
 * @param {Express.Response} res 
 */
function checkJobsHealth(res) {
  const enabledJobsLastExecutionTime = getEnabledJobsLastExecutionTime()
  const currentTime = new Date()
  for (const job in enabledJobsLastExecutionTime) {
    const lastExectuionTime = (enabledJobsLastExecutionTime[/** @type {'createAndUploadCsvsJob'|'sendOrderEmailNotificationJob'|'checkForStuckOrdersJob'|'sendOrderUpdatesJob'} */ (job)]).getTime()
    if ((currentTime.getTime() - lastExectuionTime) > jobTotalTimeout + 1000) {
      logger.error({
        type: 'check_job_health_failure',
        message: `${job} failed to ran in a timely manner. Current Time: ${currentTime.getTime()}, last execution times: ${lastExectuionTime}.`
      })
      res.status(500).send('failed')
      return false
    }
  }
  return true
}

app.get('/healthz', async function (req, res) {
  const healthzAuthorization = process.env.HEALTHZ_AUTHORIZATION
  const authorization = req.headers.authorization
  if (authorization && healthzAuthorization && authorization === healthzAuthorization) {
    logger.info('Kubernetes initiating liveliness probe...')
    // jobs have not ran in the expected time
    if (checkJobsHealth(res)) {
      // some of the outgoing calls cannot be made
      await checkServicesHealth(res)
    }
  } else {
    res.status(404).send()
  }
})

app.use('/notifications', (req, res, next) => {
  const authorization = req.header('authorization') || ''
  const [, bearerToken] = authorization.split(' ')

  if (bearerToken && NOTIFICATIONS_BEARER_TOKEN && bearerToken === NOTIFICATIONS_BEARER_TOKEN) { // configured when adding commercetools API extension
    next()
    return
  }

  res.status(401).send('Invalid authorization')
})

// Can be invoked to send the notification for a specific order e.g. in the case that we failed to send it via the job.
app.post('/notifications/order-created', async (req, res) => {
  let orderId
  try {
    orderId = req.body.orderId
    await sendOrderEmailNotificationByOrderId(orderId)
    console.log(`Sent email notification for order ${orderId}`)
    res.send()
  } catch (err) {
    console.error(`Unable to send confirmation email for order ${orderId}: ${err.message}`)
    res.status(400).send()
  }
})

/**
 * Can be used to setup an endpoint to retrieve list of orders
 * Disabled for now for reducing attack vektor
 */
// @ts-ignore
// eslint-disable-next-line no-unused-vars
async function list (req, res) {
  try {
    const config = await req.body.config
    const sftp = new client()
    await sftp.connect({
      ...config,
      privateKey: Buffer.from(config.privateKey,'base64')
    })
    const list = await sftp.list(SFTP_INCOMING_ORDERS_PATH)
    sftp.end()
    res.json(list)
  } catch (error) {
    console.error('Failed to list orders: ', error)
    res.status(400)
    res.send()
  }
}

const port = process.env.PORT || 8080

export const start = async () => {
  logger.info('hr-order-service starting')
  app.listen(port, () => {
    logger.info('Server started at port: ' + port)
  })
  const orderSaveConsumer = new OrderSaveConsumer(kafkaClient, logger)
  if (DISABLE_ORDER_SAVE_ACTOR === 'false') {
    await orderSaveConsumer.startConsumer()
  }

  const stop = async () => {
    logger.info('hr-order-service stopping')
    await orderSaveConsumer.disconnect()
    logger.info('hr-order-service stopped')
    process.exit()
  }

  process.on('SIGINT', stop)
  process.on('SIGTERM', stop)
}

start()
