require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const client = require('ssh2-sftp-client')

require('./jobs')
const { sftpConfig } = require('./config')
const { keepAliveRequest } = require('./commercetools')
const { sendOrderEmailNotificationByOrderId } = require('./email')

const { SFTP_INCOMING_ORDERS_PATH, NOTIFICATIONS_BEARER_TOKEN } = (/** @type {import('./orders').Env} */ (process.env))

const app = express()
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json())
// remove x-powered-by header
app.disable('x-powered-by')

/**
 * Can be used to setup a health endpoint
 * Disabled for now for reducing attack vektor
 */
// @ts-ignore
// eslint-disable-next-line no-unused-vars
async function health (res) {
  try {
    const sftp = new client()
    console.log('Initiating health check...')
    await sftp.connect({
      ...sftpConfig,
      privateKey: Buffer.from(sftpConfig.privateKey,'base64')
    })
    await Promise.all([
      keepAliveRequest(),
      sftp.list(SFTP_INCOMING_ORDERS_PATH)
    ])
    sftp.end()
    console.log('Health check successful.')
    res.status(200).send('ok')
  } catch (error) {
    console.error('Health check failed: ')
    if (error.body && Array.isArray(error.body.errors)) {
      error.body.errors.forEach(console.error)
    } else {
      console.error(error)
    }
    res.status(500).send('failed')
  }
}

app.get('/healthz', async function(req, res) {
  const healthzAuthorization = process.env.HEALTHZ_AUTHORIZATION
  const authorization = req.headers.authorization
  if (authorization && healthzAuthorization && authorization === healthzAuthorization) {
    console.log('Kubernetes initiating liveliness probe...')
    await health(res)
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
    orderId = req.body.resource.id
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
app.listen(port, function() {
  console.log('Server started at port: ' + port)
})
