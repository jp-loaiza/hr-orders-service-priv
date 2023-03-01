require('dotenv').config()
require('newrelic')

import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import client from 'ssh2-sftp-client'

require('./jobs/jobs')
import {
  sftpConfig,
  DISABLE_ORDER_SAVE_ACTOR,
  PROCESS_ORDER_EVENTS,
  SFTP_INCOMING_ORDERS_PATH,
  NOTIFICATIONS_BEARER_TOKEN
} from './config'
import { keepAliveRequest } from './commercetools/commercetools'
import { sendOrderEmailNotificationByOrderId } from './emails/email'
import logger, { serializeError } from './logger'

import kafkaClient from './events/kafkaClient'
import OrderSaveConsumer from './events/OrderSaveConsumer'
import OrderProcessingConsumer from './events/OrderProcessingConsumer'
import { checkJobsHealth } from './jobs/jobs.utils'

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
async function checkServicesHealth(res: Response) {
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
        type: 'health_check',
        message: message,
        error: serializeError(error)
      })
    }
    res.status(500).send('failed')
  }
}

app.get('/healthz', async function (req: Request, res: Response) {
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

app.use('/notifications', (req: Request, res: Response, next) => {
  const authorization = req.header('authorization') || ''
  const [, bearerToken] = authorization.split(' ')

  if (bearerToken && NOTIFICATIONS_BEARER_TOKEN && bearerToken === NOTIFICATIONS_BEARER_TOKEN) { // configured when adding commercetools API extension
    next()
    return
  }

  res.status(401).send('Invalid authorization')
})

// Can be invoked to send the notification for a specific order e.g. in the case that we failed to send it via the job.
app.post('/notifications/order-created', async (req: Request, res: Response) => {
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
async function list(req: Request, res: Response) {
  try {
    const config = await req.body.config
    const sftp = new client()
    await sftp.connect({
      ...config,
      privateKey: Buffer.from(config.privateKey, 'base64')
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
  const orderProcessingConsumer = new OrderProcessingConsumer(kafkaClient, logger)
  if (PROCESS_ORDER_EVENTS) {
    await orderProcessingConsumer.startConsumer()
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
