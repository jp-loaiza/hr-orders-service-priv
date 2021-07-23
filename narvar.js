//const fetch = require('node-fetch')
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
  /*const response = await fetch(baseUrl + path, options)
  const result = await response.json()
  console.log('result:')
  console.log(result)
  if (response.ok) {
    if (result.status === 'FAILURE') {
      throw new Error(JSON.stringify(result))
    }
    return result
  }
  throw new Error(JSON.stringify(result))*/
}

/**
 * 
 * @param {import('./orders').NarvarOrder} order The order to send to Narvar
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

const STATES_TO_NARVAR_STATUSES /** @type {import('./orders').NarvarStateMap} */ = {
  'SHIPPED': 'SHIPPED',
  'OPEN': 'PROCESSING',
  'HOLD': 'PROCESSING',
  'IN PICKING': 'IN_PICKING',
  'CANCELLED': 'CANCELLED'
}

const LOCALE_TO_PRODUCT = {
  'en-CA': 'product',
  'fr-CA': 'produit'
}

/**
 * @param {string} productSlug
 * @param {string} locale
 * @returns string
 */
const getItemUrl = (productSlug, locale) => `https://harryrosen.com/${locale.substr(0,2)}/${LOCALE_TO_PRODUCT[locale]}/${productSlug}`

/**
 * @param {import('./orders').LineItem} item
 * @param {Array<import('./orders').OrderState>} states
 * @param { 'en-CA' | 'fr-CA' } locale
 * @returns string
 */
const getItemFulfillmentStatus = (item, states, locale) => {
  const state = states.find(s => item.state[0].state.id === s.id)
  return state ? STATES_TO_NARVAR_STATUSES[state.name[locale]] : 'PROCESSING'
}

/**
 * 
 * @param {Array<{ name: string, value: any }>} attributes 
 * @param {string} attrName 
 * @param {{value: boolean}} attrDefault 
 * @returns {{value: boolean}}
 */
const getAttributeOrDefaultBoolean = (attributes, attrName, attrDefault) => {
  const obj = attributes.find(a => a.name === attrName)
  return obj ? obj : attrDefault
}

/**
 * 
 * @param {Array<{ name: string, value: any }>} attributes 
 * @param {string} attrName 
 * @param {{value: any}} attrDefault 
 * @returns {{value: any}}
 */
const getAttributeOrDefaultAny = (attributes, attrName, attrDefault) => {
  const obj = attributes.find(a => a.name === attrName)
  return obj ? obj : attrDefault
}

/**
 * @param {import('./orders').Order} order
 * @param {Array<import('./orders').Shipment>} shipments
 * @param {Array<import('./orders').OrderState>} states
 * @returns {import('./orders').NarvarOrder | undefined}
 */
const convertOrderForNarvar = (order, shipments, states) => {
  console.log(`Convert order: ${order.orderNumber} - ${order.id}`)
  const state = order.state ? states.find(s => order.state.id === s.id) : null
  const locale = order.locale
  return {
    order_info: {
      order_number: order.orderNumber,
      order_date: order.createdAt,
      status: STATES_TO_NARVAR_STATUSES[state ? state.name[locale] : 'OPEN']
    },
    order_items: order.lineItems.map(item => { return {
      item_id: item.id,
      sku: item.variant.sku,
      name: item.name[locale],
      quantity: item.quantity,
      unit_price: (item.variant.prices[0].value.centAmount / 100).toFixed(2),
      item_image: item.variant.images[0].url,
      item_url: getItemUrl(item.productSlug[locale], locale),
      is_final_sale: getAttributeOrDefaultBoolean(item.variant.attributes, 'isReturnable', { value: true }).value,
      fulfillment_status: getItemFulfillmentStatus(item, states, locale),
      fulfillment_type: order.custom.fields.isStorePickup ? 'BOPIS' : 'HD',
      is_gift: item.custom.fields.isGift,
      final_sale_date: order.createdAt,
      attributes: {
        deliveryItemLastModifiedDate: item.lastModifiedAt,
        brand_name: getAttributeOrDefaultAny(item.variant.attributes, 'brandName', { value: { [locale] : null } }).value[locale],
        barcode: getAttributeOrDefaultAny(item.variant.attributes, 'barcodes', { value: { obj: { barcode: null }}} ).value.obj.barcode
      },
      vendors: [
        { 'name' :  getAttributeOrDefaultBoolean(item.variant.attributes, 'isEndlessAisle', { value: false }) ? 'EA' : 'HR' }
      ],
      line_price: (item.price.value.centAmount / 100).toFixed(2)
    }}),
    pickups: !order.custom.fields.isStorePickup ? [] : shipments.map(shipment => { return {
      carrier_service: shipment.value.shipmentDetails.carrierId || null
    }}),
  }
}
  
module.exports = {
  convertOrderForNarvar,
  sendToNarvar
}