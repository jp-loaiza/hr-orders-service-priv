const client = require('ssh2-sftp-client')

const { validateOrder } = require('./validation')
const { MAXIMUM_RETRIES } = require('./constants')
const {
  fetchOrdersThatShouldBeSentToOms,
  setOrderAsSentToOms,
  setOrderErrorFields,
} = require('./commercetools')
const { generateCsvStringFromOrder } = require('./csv')
const { sftpConfig } = require('./config')
const { SFTP_INCOMING_ORDERS_PATH } = (/** @type {import('./orders').Env} */ (process.env))

/**
 * 
 * @param {number} ms time to sleep in ms
 */
async function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  })
}

const NoResponse = Symbol.for('no-response')

// TODO implement retry as a generic function so that the type of args matches the parameters expected by fn
/**
 * 
 * @param {Function} fn 
 * @param {number} maxRetries 
 * @param {number} backoff in ms
 */
function retry (fn, maxRetries = MAXIMUM_RETRIES, backoff = 1000) {
  return ( /** @param {any[]} args */ async function (...args){
    let tries = 0
    let error = null
    let response = NoResponse
    while (response === NoResponse && tries < maxRetries) {
      tries++
      error = null
      response = NoResponse
      try {
        if (tries > 1) {
          console.warn(`Retrying failed call to function ${fn.name} with arguments ${args}`)
          await sleep(tries * backoff)
        }
        response = await fn(...args)
      } catch (err) {
        error = err
      }
    }
    if (error) {
      throw error
    }
    return response
  })
}

/**
 * 
 * @param {import('./orders').Order} order
 * @explain JESTA expects CSV filenames to be of the form `Orders-YYYY-MM-DD-HHMMSS<orderNumber>.csv`.
 */
const generateFilenameFromOrder = order => {
  const orderDate = new Date(order.createdAt)
  const dateString = order.createdAt.slice(0, 10)
  const timeString = [orderDate.getUTCHours(), orderDate.getUTCMinutes(), orderDate.getUTCSeconds()]
    .map(timeComponent => timeComponent.toString().padStart(2, '0'))
    .join('')

  return `Orders-${dateString}-${timeString}${order.orderNumber}.csv`
}

const createAndUploadCsvs = async () => {
  let sftp
  try {
    sftp = new client()
    await sftp.connect(sftpConfig)
    console.log('Connected to SFTP server')

    const orders = await fetchOrdersThatShouldBeSentToOms()
    console.log(`Starting to process ${orders.length} orders`)

    for (const order of orders) {
      let csvString
      try {
        if (!validateOrder(order)) throw new Error('Invalid order')
        csvString = generateCsvStringFromOrder(order)
      } catch (err) {
        console.error(`Unable to generate CSV for order ${order.orderNumber}`)
        const errorMessage = err.message === 'Invalid order' ? JSON.stringify(validateOrder.errors) : 'Unable to generate CSV'
        console.error(errorMessage)
        console.error(err)
        // we retry in case the version of the order has changed by the notifications job
        await retry(setOrderErrorFields)(order, errorMessage, false)
        continue
      }
      try {
        await sftp.put(Buffer.from(csvString), SFTP_INCOMING_ORDERS_PATH + generateFilenameFromOrder(order))
      } catch (err) {
        console.error(`Unable to upload CSV to JESTA for order ${order.orderNumber}`)
        await retry(setOrderErrorFields)(order, 'Unable to upload CSV to JESTA', true)
        continue
      }
      // we retry in case the version of the order has changed by the notifications job
      await retry(setOrderAsSentToOms)(order)
    }
    console.log('Done processing orders')
  } catch (err) {
    console.error('Unable to process orders:')
    console.error(err)
  } finally {
    try {
      if (sftp) {
        await sftp.end()
      }
    } catch (err) {
      console.error('Unable to close SFTP connection:')
      console.error(err)
    }
  }
}

module.exports = {
  sleep,
  retry,
  createAndUploadCsvs,
  generateFilenameFromOrder,
}
