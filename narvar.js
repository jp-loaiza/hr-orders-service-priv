const fetch = require('node-fetch')
const base64 = require('base-64')
//import fetch from 'node-fetch'
//import base64 from 'base-64'

const baseUrl = process.env.NARVAR_BASE_URL
const username = process.env.NARVAR_USERNAME
const password = process.env.NARVAR_PASSWORD


/**
 * @param {string} path Path to the Api
 * @param {*} options Options with the request body and authentication parameters
 * @returns Result of request if it was successful
 * @throws Error if response is not successful
 * */

const makeNarvarRequest = async (path, options) => {
  console.log('narvar request:')
  console.log(path)
  console.log(baseUrl)
  console.log(options)
  const response = await fetch(baseUrl + path, options)
  const result = await response.json()
  console.log('result:')
  console.log(result)
  if (response.ok) {
    if (result.status === 'FAILURE') {
      throw new Error(JSON.stringify(result))
    }
    return result
  }
  throw new Error(JSON.stringify(result))
}

/**
 * 
 * @param {import('./orders').Order} order The order to send to Narvar
 */

const sendToNarvar = async (order) => {
  // convert order to Narvar format
  const options = {
    body: JSON.stringify(order),
    headers: {
      Authorization: `Basic ${base64.encode(username + ':' + password)}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }
  return makeNarvarRequest('/orders', options)
}

/**
 * @param {import('./orders').Order} order
 * @returns {import('./orders').NarvarOrder | undefined}
 */
const convertOrderForNarvar = order => {
  return undefined
}
  
module.exports = {
  convertOrderForNarvar,
  sendToNarvar
}