const client = require('ssh2-sftp-client')

const {
  fetchOrdersThatShouldBeSentToOms,
  setOrderAsSentToOms,
  setOrderErrorMessage
} = require('./commercetools')
const { generateCsvStringFromOrder } = require('./csv')
const { sftpConfig } = require('./config')
const { SFTP_INCOMING_ORDERS_PATH } = (/** @type {import('./orders').Env} */ (process.env))

/**
 * 
 * @param {import('./orders').Order} order
 * @explain JESTA expects CSV filenames to be of the form `Orders-YYYY-MM-DD-HHMMSS-<orderNumber>.csv`.
 */
const generateFilenameFromOrder = order => {
  const orderDate = new Date(order.createdAt)
  const dateString = order.createdAt.slice(0, 10)
  const timeString = [orderDate.getUTCHours(), orderDate.getUTCMinutes(), orderDate.getUTCSeconds()]
    .map(timeComponent => timeComponent.toString().padStart(2, '0'))
    .join('')

  return `Orders-${dateString}-${timeString}-${order.orderNumber}.csv`
}

const createAndUploadCsvs = async () => {
  let sftp
  try {
    sftp = new client()
    await sftp.connect({
      ...sftpConfig,
      privateKey: Buffer.from(sftpConfig.privateKey, 'base64')
    })
    console.log('Connected to SFTP server')

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
    try {
      sftp && sftp.end()
    } catch (err) {
      console.error('Unable to close SFTP connection:')
      console.error(err)
    }
  }
}


module.exports = {
  createAndUploadCsvs,
  generateFilenameFromOrder
}
