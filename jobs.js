
require('dotenv').config()

const { createAndUploadCsvs } = require('./jobs.utils')
const { ORDER_UPLOAD_INTERVAL } = (/** @type {import('./orders').Env} */ (process.env))

/**
 * 
 * @param {number} ms time to sleep in ms
 */
async function asleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms)
  })
}

async function createAndUploadCsvsJob () {
  if (!(Number(ORDER_UPLOAD_INTERVAL) > 0)) throw new Error('ORDER_UPLOAD_INTERVAL must be a positive number')
  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.time('Create and uploads CSVs')
    try {
      await createAndUploadCsvs()
    } catch (error) {
      console.error('Failed to create and uploads CSVs: ', error)
    }
    console.timeEnd('Create and uploads CSVs')
    await asleep(Number(ORDER_UPLOAD_INTERVAL))
  }
}

createAndUploadCsvsJob()
