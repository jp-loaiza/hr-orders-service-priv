require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const client = require('ssh2-sftp-client')

const {
  fetchOrdersThatShouldBeSentToOms,
  setOrderAsSentToOms,
  setOrderErrorMessage
} = require('./commercetools')
const { generateCsvStringFromOrder } = require('./csv')
const { generateFilenameFromOrder } = require('./server.utils')
const { SFTP_HOST, SFTP_PORT, SFTP_USERNAME, SFTP_PRIVATE_KEY, SFTP_INCOMING_ORDERS_PATH, ORDER_UPLOAD_INTERVAL} = (/** @type {import('./orders').Env} */ (process.env))

/**
 * sftp config
 */
const config = {
  host: SFTP_HOST,
  port: Number(SFTP_PORT),
  username: SFTP_USERNAME,
  privateKey: SFTP_PRIVATE_KEY
}

const app = express()
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Parse application/json
app.use(bodyParser.json())

app.get('/', async function(_, res) {
  res.send('ok')
})

app.get('/health', async function(_, res) {
  try {
    const sftp = new client()
    await sftp.connect({
      ...config,
      privateKey: Buffer.from(config.privateKey,'base64')
    })
    await sftp.list(SFTP_INCOMING_ORDERS_PATH)
    sftp.end()
    res.send('ok')
  } catch (error) {
    console.error('Health check failed: ', error)
    res.status(500)
    res.send()
  }
})

app.get('/list', async function(req, res) {
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
})

const createAndUploadCsvs = async () => {
  let sftp
  try {
    sftp = new client()
    await sftp.connect({
      ...config,
      privateKey: Buffer.from(config.privateKey, 'base64')
    })

    const orders = await fetchOrdersThatShouldBeSentToOms()
    console.log(`Starting to process ${orders.length} orders`)

    for (const order of orders) {
      let csvString
      try {
        csvString = generateCsvStringFromOrder(order)
      } catch (err) {
        console.error(`Unable to generate CSV for order ${order.orderNumber}`)
        setOrderErrorMessage(order, 'Unable to generate CSV')
        continue
      }
      try {
        await sftp.put(Buffer.from(csvString), SFTP_INCOMING_ORDERS_PATH + generateFilenameFromOrder(order))
      } catch (err) {
        console.error(`Unable to upload CSV to JESTA for order ${order.orderNumber}`)
        setOrderErrorMessage(order, 'Unable to upload CSV to JESTA')
        continue
      }
      setOrderAsSentToOms(order)
    }
    console.log('Done processing orders')
  } catch (err) {
    console.error('Unable to process orders:')
    console.error(err)
  } finally {
    sftp && sftp.end()
  }
}

if (!ORDER_UPLOAD_INTERVAL) throw new Error('ORDER_UPLOAD_INTERVAL is undefined')
setInterval(createAndUploadCsvs, Number(ORDER_UPLOAD_INTERVAL))

const port = process.env.PORT || 8080
app.listen(port, function() {
  console.log('Server started at port: ' + port)
})
