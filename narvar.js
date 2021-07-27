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
 * 
 * @param {Array<import('./orders').LineItem>} items 
 * @param {string} item_id 
 * @returns {string}
 */

const findItemSku = (items, item_id) => {
  const item = items.find(item => item.id === item_id)
  return item ? item.variant.sku : ''
}

/**
 * 
 * @param {Array<import('./orders').Shipment>} shipments 
 * @param {string} lineItemId 
 * @returns 
 */

const lineNumberFromShipments = (shipments, lineItemId) => {
  const shipment = shipments.find(s => s.id === lineItemId)
  return shipment ? shipment.value.shipmentDetails[0].line : null
}

/**
 * 
 * @param {import('./orders').Order} order
 * @param {Array<import('./orders').OrderState>} states
 * @param {Array<import('./orders').Shipment>} shipments 
 * @returns {Array<import('./orders').NarvarOrderItem>}
 */
const convertItems = (order, states, shipments) => {
  const locale = order.locale
  let lineCounter = 1 // Not sure this workaround is fine
  return order.lineItems.map(item => { return {
    item_id: item.id,
    sku: item.variant.sku,
    name: item.name[locale],
    quantity: item.quantity,
    unit_price: (item.variant.prices[0].value.centAmount / 100).toFixed(2), // TODO: double check
    item_image: item.variant.images[0].url, // TODO: double check
    item_url: getItemUrl(item.productSlug[locale], locale),
    is_final_sale: !getAttributeOrDefaultBoolean(item.variant.attributes, 'isReturnable', { value: true}).value,
    fulfillment_status: getItemFulfillmentStatus(item, states, locale),
    fulfillment_type: order.custom.fields.isStorePickup ? 'BOPIS' : 'HD',
    is_gift: item.custom.fields.isGift,
    final_sale_date: order.createdAt,
    line_number: lineNumberFromShipments(shipments, item.id) || lineCounter++,
    attributes: {
      orderItemLastModifiedDate: item.lastModifiedAt,
      brand_name: getAttributeOrDefaultAny(item.variant.attributes, 'brandName', { value: { [locale] : null } }).value[locale],
      barcode: getAttributeOrDefaultAny(item.variant.attributes, 'barcodes', { value: [ { obj: { barcode: null }} ]} ).value[0].obj.barcode
    },
    vendors: [
      { 'name' :  getAttributeOrDefaultBoolean(item.variant.attributes, 'isEndlessAisle', { value: false }).value ? 'EA' : 'HR' }
    ],
    line_price: (item.totalPrice.centAmount / 100).toFixed(2)
  }})
}

/**
 * 
 * @param {import('./orders').Order} order
 * @param {Array<import('./orders').Shipment>} shipments
 * @returns {Array<import('./orders').NarvarShipment>}
 */

const convertShipments = (order, shipments) => {
  return order.custom.fields.isStorePickup ? [] : shipments/*.filter(shipment => shipment.value.shipmentDetails[0].quantityShipped != 0)*/.map(shipment => { return {
    carrier: shipment.value.shipmentDetails[0].carrierId || null,
    tracking_number: shipment.value.shipmentDetails[0].trackingNumber || null,
    carrier_service: shipment.value.shipmentDetails[0].serviceType || null,
    items_info: [ { 
      quantity: shipment.value.shipmentDetails[0].quantityShipped,
      sku: findItemSku(order.lineItems, shipment.value.shipmentDetails[0].lineItemId),
      item_id: shipment.value.shipmentDetails[0].lineItemId
    } ],
    // TODO: use order.itemShippingAddresses?
    shipped_to: {
      first_name: order.shippingAddress.firstName,
      last_name: order.shippingAddress.lastName,
      phone: order.shippingAddress.phone,
      email: order.shippingAddress.email,
      address: {
        street_1: order.shippingAddress.streetName,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zip: order.shippingAddress.postalCode,
        country: order.shippingAddress.country
      }
    },
    shipped_from: {
      first_name: order.itemShippingAddress.firstName,
      last_name: order.itemShippingAddress.lastName,
      street_1: order.itemShippingAddress.streetName,
      phone: order.itemShippingAddress.phone,
      email: order.itemShippingAddress.email,
      address: {
        street_1: order.itemShippingAddress.streetName,
        city: order.itemShippingAddress.city,
        state: order.itemShippingAddress.state,
        zip: order.itemShippingAddress.postalCode,
        country: order.itemShippingAddress.country
      }
    },
    ship_date: shipment.value.shipmentDetails[0].shippedDate || null,
    attributes: {
      deliveryItemLastModifiedDate: shipment.value.shipmentLastModifiedDate
    }
  }})
}

/**
 * 
 * @param {import('./orders').Order} order
 * @param {Array<import('./orders').Shipment>} shipments
 * @returns {Array<import('./orders').NarvarPickup>}
 */

const convertPickups = (order, shipments) => {
  return order.custom.fields.isStorePickup ? [] : shipments.filter(shipment => shipment.value.shipmentDetails[0].quantityShipped != 0).map(shipment => { return {
    id: shipment.id,
    status: STATES_TO_NARVAR_STATUSES[shipment.value.shipmentDetails[0].status],
    items_info: [ { 
      quantity: shipment.value.shipmentDetails[0].quantityShipped,
      sku: findItemSku(order.lineItems, shipment.value.shipmentDetails[0].lineItemId),
      item_id: shipment.value.shipmentDetails[0].lineItemId
    } ],
    store: {
      id: shipment.value.shipmentDetails[0].siteId,
      phone_number: order.itemShippingAddress.phone,
      address: {
        street_1: order.itemShippingAddress.streetName,
        city: order.itemShippingAddress.city,
        state: order.itemShippingAddress.state,
        zip: order.itemShippingAddress.postalCode,
        country: order.itemShippingAddress.country
      }
    },
    attributes: {
      deliveryItemLastModifiedDate: shipment.value.shipmentLastModifiedDate
    }
  }})
}

/**
 * @param {import('./orders').Order} order
 * @param {Array<import('./orders').Shipment>} shipments
 * @param {Array<import('./orders').OrderState>} states
 * @returns {import('./orders').NarvarOrder | undefined}
 */
const convertOrderForNarvar = (order, shipments, states) => {
  console.log(`Convert order: ${order.orderNumber} - ${order.id}`)
  console.log(JSON.stringify(order, null, 2))
  const state = order.state ? states.find(s => order.state.id === s.id) : null
  const locale = order.locale
  return {
    order_info: {
      order_number: order.orderNumber,
      order_date: order.createdAt,
      status: STATES_TO_NARVAR_STATUSES[state ? state.name[locale] : 'OPEN']
    },
    order_items: convertItems(order, states),
    shipments: convertShipments(order, shipments),
    pickups: convertPickups(order, shipments),
    billing: {
      billed_to: {
        first_name: order.billingAddress.firstName,
        last_name: order.billingAddress.lastName,
        phone: order.billingAddress.phone,
        email: order.billingAddress.email,
        address: {
          street_1: order.billingAddress.streetName,
          city: order.billingAddress.city,
          state: order.billingAddress.state,
          zip: order.billingAddress.postalCode,
          country: order.billingAddress.country
        },
      },
      amount: (order.taxedPrice.totalGross.centAmount / 100.0).toFixed(2),
      tax_amount: (order.taxedPrice.taxPortions.reduce((accumulator, currentValue) => accumulator + currentValue.amount.centAmount, 0) / 100.0).toFixed(2),
      shipping_handling: (order.shippingInfo.shippingRate.price.centAmount / 100).toFixed(2)
    },
    customer: {
      first_name: order.shippingAddress.firstName,
      last_name: order.shippingAddress.lastName,
      phone: order.shippingAddress.phone,
      email: order.shippingAddress.email,
      address: {
        street_1: order.shippingAddress.streetName,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zip: order.shippingAddress.postalCode,
        country: order.shippingAddress.country
      }
    }
  }
}
  
module.exports = {
  convertOrderForNarvar,
  sendToNarvar
}
