require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
let client = require('ssh2-sftp-client')
const { parseAsync } = require('json2csv')

const { SFTP_HOST, SFTP_PORT, SFTP_USERNAME, SFTP_PRIVATE_KEY, SFTP_INCOMING_ORDERS_PATH, INCOMING_ORDER_FIELDS } = (/** @type {Env} */ (process.env))
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
    res.json('ok')
  } catch (error) {
    res.status(500)
    res.send()
  }
})

app.get('/list', async function(req, res) {
  const config = await req.body.config
  const sftp = new client()
  await sftp.connect({
    ...config,
    privateKey: Buffer.from(config.privateKey,'base64')
  })
  const list = await sftp.list(SFTP_INCOMING_ORDERS_PATH)
  sftp.end()
  res.json(list)
})

const fields = JSON.parse(INCOMING_ORDER_FIELDS)
app.post('/put', async function(req, res) {
  const { config, fileName, data } = await req.body
  const sftp = new client()
  await sftp.connect({
    ...config,
    privateKey: Buffer.from(config.privateKey,'base64')
  })
  const csv = await parseAsync(data, { fields })
  const result = await sftp.put(Buffer.from(csv),SFTP_INCOMING_ORDERS_PATH + fileName)
  sftp.end()
  res.json(result)
})

const port = process.env.PORT || 8080
app.listen(port, function() {
  console.log('Server started at port: ' + port)
})
