require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const client = require('ssh2-sftp-client')

const { createAndUploadCsvs } = require('./server.utils')
const { sftpConfig } = require('./config')

const { SFTP_INCOMING_ORDERS_PATH, ORDER_UPLOAD_INTERVAL} = (/** @type {import('./orders').Env} */ (process.env))

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
      ...sftpConfig,
      privateKey: Buffer.from(sftpConfig.privateKey,'base64')
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

if (isNaN(Number(ORDER_UPLOAD_INTERVAL)) || Number(ORDER_UPLOAD_INTERVAL) === 0) throw new Error('ORDER_UPLOAD_INTERVAL must be a positive number')
setInterval(createAndUploadCsvs, Number(ORDER_UPLOAD_INTERVAL))

const port = process.env.PORT || 8080
app.listen(port, function() {
  console.log('Server started at port: ' + port)
})
