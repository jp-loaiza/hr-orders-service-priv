//const fetch = require('node-fetch')
const base64 = require('base-64')
const fetch = require('node-fetch')
//import base64 from 'base-64'

const baseUrl = process.env.NARVAR_BASE_URL

const harryRosenUsername = process.env.NARVAR_USERNAME
const harryRosenpassword = process.env.NARVAR_PASSWORD

const finalCutUsername = process.env.NARVAR_USERNAME_997
const finalCutPassword = process.env.NARVAR_PASSWORD_997

const finalCut = process.env.FINAL_CUT
const enableFinalCutToNarvar = process.env.SEND_FINAL_CUT_TO_NARVAR === 'true' ? true : false

const { fetchItemInfo, fetchCategoryInfo } = require('../commercetools/commercetools')
const { default: logger } = require('../logger')

/**
 * @param {string} path Path to the Api
 * @param {*} options Options with the request body and authentication parameters
 * @returns Result of request if it was successful
 * @throws Error if response is not successful
 * */

const makeNarvarRequest = async (path, options) => {
  const response = await fetch(baseUrl + path, options)
  const result = await response.json()
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
 * @param {import('../orders').NarvarOrder} order The order to send to Narvar
 */

const sendToNarvar = async (order) => {
  // convert order to Narvar format
  const options = {
    body: JSON.stringify(order),
    headers: {
      Authorization: `Basic ${base64.encode(harryRosenUsername + ':' + harryRosenpassword)}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }

  //@todo Remove after HRC-6808 is deployed
  if (order.order_info.attributes.siteId === finalCut && enableFinalCutToNarvar) {
    options.headers.Authorization = `Basic ${base64.encode(finalCutUsername + ':' + finalCutPassword)}`
  }

  logger.info(`check the narvar payload: ${JSON.stringify(options.body)}`)
  return makeNarvarRequest('/orders', options)
}

const STATES_TO_NARVAR_STATUSES /** @type {import('./orders').NarvarStateMap} */ = {
  'SHIPPED': 'SHIPPED',
  'OPEN': 'PROCESSING',
  'HOLD': 'PROCESSING',
  'IN PICKING': 'PROCESSING',
  'CANCELLED': 'CANCELLED',
  'PICKUP': 'READY_FOR_PICKUP',
  'PICKEDUP': 'PICKED_UP'
}

// As of 2021-11-30 this is the same as the one above, see comments on HRC-4777
// TODO: if it stays the same then merge these into one and simplify the code
const STATES_TO_NARVAR_PICKUP_STATUSES /** @type {import('./orders').NarvarStateMap} */ = {
  'SHIPPED': 'SHIPPED',
  'OPEN': 'PROCESSING',
  'HOLD': 'PROCESSING',
  'IN PICKING': 'PROCESSING',
  'CANCELLED': 'CANCELLED',
  'PICKUP': 'READY_FOR_PICKUP',
  'PICKEDUP': 'PICKED_UP'
}

const LOCALE_TO_PRODUCT = {
  'en-CA': 'product',
  'fr-CA': 'produit'
}

const JESTA_CARRIER_ID_TO_NARVAR_CARRIER_ID = {
  'FDX': 'fedex',
  'CP': 'canadapost'
}

const JESTA_SERVICE_TYPES_TO_NARVAR_SERVICE_TYPES = {
  FDX: {
    EXPRESS: 'E1AM',
    GROUND: 'FG',
    ECONOMY: 'E3',
    OVERNIGHT: 'E1',
    STANDARD_OVERNIGHT: 'E1',
    'PRIORITY OVERNIGHT': 'E1AM'
  },
  CP: {
    'EXPEDITED PARCEL': 'EP',
    XPRESSPOST: 'E2',
    ECONOMY: 'ECONOMY'
  }
}

/**
 * @param {string} productSlug
 * @param {string} locale
 * @returns string
 */
const getItemUrl = (productSlug, locale) => `https://harryrosen.com/${locale.substr(0, 2)}/${LOCALE_TO_PRODUCT[locale]}/${productSlug}`

/**
 * @param {import('../orders').LineItem} item
 * @param {Array<import('../orders').OrderState>} states
 * @param { 'en-CA' | 'fr-CA' } locale
 * @returns string
 */
const getItemFulfillmentStatus = (item, states, locale, isStorePickup) => {
  const state = states.find(s => item.state[0].state.id === s.id)
  if (isStorePickup) {
    return (state && STATES_TO_NARVAR_PICKUP_STATUSES[state.name[locale]]) ? STATES_TO_NARVAR_PICKUP_STATUSES[state.name[locale]] : 'PROCESSING'
  }
  return (state && STATES_TO_NARVAR_STATUSES[state.name[locale]]) ? STATES_TO_NARVAR_STATUSES[state.name[locale]] : 'PROCESSING'
}

/**
 * @param {import('../orders').LineItem} item
 */
async function fetchProductCategories(item) {
  const productDetails = await fetchItemInfo(item.productId)
  const categoryInfo = await fetchCategoryInfo(productDetails.masterData.current.categories.map(x => x.id))
  const level1Category = categoryInfo.find(x => x.key.startsWith('DPMROOTCATEGORY-') && x.ancestors.length === 1)
  const level2Category = categoryInfo.find(x => x.key.startsWith('DPMROOTCATEGORY-') && x.ancestors.length === 2)
  const level3Category = categoryInfo.find(x => x.key.startsWith('DPMROOTCATEGORY-') && x.ancestors.length === 3)
  return {
    level1Category: level1Category && level1Category.name['en-CA'] || null,
    level2Category: level2Category && level2Category.name['en-CA'] || null,
    level3Category: level3Category && level3Category.name['en-CA'] || null
  }
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
 * @param {import('../orders').LineItem} item
 * @returns {number}
 */
const findUnitPrice = (item) => {
  return item.discountedPrice ? (item.discountedPrice.value.centAmount / 100) : (item.variant.prices[0].value.centAmount / 100)
}

/**
 *
 * @param {import('../orders').LineItem} item
 * @returns {number | null}
 */
const findDiscountedPrice = (item) => {
  return item.discountedPrice ? (item.discountedPrice.value.centAmount / 100) : null
}

/**
 *
 * @param {import('../orders').LineItem} item
 * @returns {number | null}
 */
const findDiscountPercent = (item) => {
  return item.discountedPrice ? parseFloat((((item.variant.prices[0].value.centAmount) - item.discountedPrice.value.centAmount) / (item.variant.prices[0].value.centAmount / 100)).toFixed(2)) : null
}

/**
 *
 * @param {Array<import('../orders').LineItem>} items
 * @param {string} item_id
 * @returns {string}
 */

const findItemSku = (items, item_id) => {
  const item = items.find(item => item.id === item_id)
  return item ? item.variant.sku : ''
}

/**
 *
 * @param {Array<import('../orders').Shipment>} shipments
 * @param {string} lineItemId
 * @returns {number | null}
 */

const lineNumberFromShipments = (shipments, lineItemId) => {
  const shipment = shipments.find(s => (s.value.shipmentDetails[0] && (s.value.shipmentDetails[0].lineItemId === lineItemId)))
  return shipment ? shipment.value.shipmentDetails[0].line : null
}

/**
 *
 * @param {import('../orders').NarvarShipment} shipment
 * @param {string} order_number
 * @returns {boolean}
 */

function filterMissingTrackingNumberMessages(shipment, order_number) {
  if (!shipment.tracking_number) {
    console.error(`Shipment ${shipment.id} for non-BOPIS order ${order_number} has no tracking number`)
    return false
  }
  return true
}

/**
 *
 * @param {import('../orders').NarvarShipment} shipment
 * @param {string} order_number
 * @returns {boolean}
 */

function checkShipmentItemIdForNull(shipment, order_number) {
  if (!shipment.items_info[0].item_id) {
    // we want to skip messages with no line item id but not fail them since there's no point retrying. We log out a message here for alerting purposes
    console.error(`Cannot process messages with no line item id. Order number: ${order_number}`)
    return false
  }
  return true
}

/**
 *
 * @param {import('../orders').NarvarShipment} shipment
 * @param {string} order_number
 * @returns {boolean}
 */

function checkShippedQuantity(shipment, order_number) {
  if (!shipment.items_info[0].quantity) {
    // we also want to skip messages with quantity = 0. We log out a message here for alerting purposes
    console.error(`Cannot process messages with quantity shipped = 0. Order number: ${order_number}`)
    return false
  }
  return true
}

/**
 * 
 * @param {import('../orders').Order} order
 * @param {Array<import('../orders').OrderState>} states
 * @param {Array<import('../orders').Shipment>} shipments
 * @returns {Promise<Array<import('../orders').NarvarOrderItem>>}
 */
const convertItems = async (order, states, shipments, isStorePickup) => {
  const locale = order.locale
  let lineCounter = 1
  return Promise.all(order.lineItems.map(async (item) => {
    const categories = await fetchProductCategories(item)
    return {
      item_id: item.id,
      sku: item.variant.sku,
      name: item.name[locale],
      quantity: item.quantity,
      category_list: Object.values(categories).filter(c => c !== null),
      category1: categories.level1Category,
      category2: categories.level2Category,
      category3: categories.level3Category,
      price: item.price.value.centAmount / 100,
      variant: item.variant.id,
      unit_price: findUnitPrice(item),
      discount_amount: findDiscountedPrice(item),
      discount_percent: findDiscountPercent(item),
      image_url: item.variant.images[0].url,
      item_url: getItemUrl(item.productSlug[locale], locale),
      final_sale: !getAttributeOrDefaultBoolean(item.variant.attributes, 'isReturnable', { value: true }).value,
      fulfillment_status: getItemFulfillmentStatus(item, states, locale, isStorePickup),
      fulfillment_type: order.custom.fields.isStorePickup ? 'BOPIS' : 'HD',
      is_gift: item.custom.fields.isGift,
      final_sale_date: order.custom.fields.orderCreatedDate || order.createdAt,
      line_number: lineNumberFromShipments(shipments, item.id) || lineCounter++,
      brand: getAttributeOrDefaultAny(item.variant.attributes, 'brandName', { value: { [locale]: null } }).value[locale],
      vendors: [
        { 'name': getAttributeOrDefaultBoolean(item.variant.attributes, 'isEndlessAisle', { value: false }).value ? 'EA' : 'HR' }
      ],
      line_price: (item.totalPrice.centAmount / 100),
      product_type: getAttributeOrDefaultAny(item.variant.attributes, 'productType', { value: null }).value,
      product_id: item.productKey,
      dimensions: null,
      backordered: null,
      vendor: null,
      item_promise_date: null,
      events: null,
      colour: getAttributeOrDefaultAny(item.variant.attributes, 'colour', { value: { [locale]: null } }).value[locale],
      size: getAttributeOrDefaultAny(item.variant.attributes, 'size', { value: { [locale]: null } }).value[locale],
      //style: getAttributeOrDefaultAny(item.variant.attributes, 'styleAndMeasurements', { value: { [locale] : null } }).value[locale],
      original_unit_price: item.variant.prices[0].value.centAmount / 100,
      original_line_price: null,
      narvar_convert_id: null
    }
  }))
}

/**
 *
 * @param {import('../orders').Order} order
 * @param {Array<import('../orders').Shipment>} shipments
 * @returns {Array<import('../orders').NarvarShipment>}
 */

const convertShipments = (order, shipments) => {
  return !order.custom.fields.isStorePickup && shipments.length ? shipments.filter(shipment => getShipmentStatusMapping(shipment) === 'SHIPPED').map(shipment => {
    return {
      id: shipment.id,
      carrier: shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].carrierId ? JESTA_CARRIER_ID_TO_NARVAR_CARRIER_ID[shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].carrierId] : null, // carrier
      tracking_number: shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].trackingNumber || null, // tracking number
      carrier_service: shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].carrierId ? JESTA_SERVICE_TYPES_TO_NARVAR_SERVICE_TYPES[shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].carrierId][shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].serviceType] : null, // service
      items_info: shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped != 0).map(shipmentDetail => {
        return {
          quantity: shipmentDetail.quantityShipped,
          sku: findItemSku(order.lineItems, shipmentDetail.lineItemId),
          item_id: shipmentDetail.lineItemId
        }
      })
      ,
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
        first_name: shipment.value.fromStoreName || 'N/A',
        last_name: '',
        phone: shipment.value.fromHomePhone || 'N/A',
        email: '',
        address: {
          street_1: shipment.value.fromAddress1 || 'N/A',
          street_2: shipment.value.fromAddress2 || 'N/A',
          city: shipment.value.fromCity || 'N/A',
          state: shipment.value.fromStateId || 'N/A',
          zip: shipment.value.fromZipCode || 'N/A',
          country: shipment.value.fromCountryId || 'N/A'
        }
      },
      ship_date: shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].shippedDate || null,
      attributes: {
        deliveryLastModifiedDate: shipment.value.shipmentLastModifiedDate,
        [`${shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].lineItemId}-deliveryItemLastModifiedDate`]: shipment.value.shipmentItemLastModifiedDate || shipment.value.shipmentLastModifiedDate,
      }
    }
  }) : []
}

/**
 *
 * @param {import('../orders').Order} order
 * @param {Array<import('../orders').Shipment>} shipments
 * @returns {Array<import('../orders').NarvarPickup>}
 */
const convertPickups = (order, shipments) => {
  return order.custom.fields.isStorePickup && shipments.length ? shipments.filter(shipment => getShipmentStatusMapping(shipment) === 'PICKUP' || getShipmentStatusMapping(shipment) === 'PICKEDUP').map(shipment => {
    return {
      id: shipment.id,
      status: {
        code: STATES_TO_NARVAR_PICKUP_STATUSES[getShipmentStatusMapping(shipment)],
        date: shipment.value.shipmentLastModifiedDate || shipment.createdAt
      },
      items_info:
        shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped != 0).map(shipmentDetail => {
          return {
            quantity: shipmentDetail.quantityShipped,
            sku: findItemSku(order.lineItems, shipmentDetail.lineItemId),
            item_id: shipmentDetail.lineItemId
          }
        })
      ,
      store: {
        id: order.custom.fields.destinationSiteId || '',
        phone_number: order.shippingAddress.phone,
        name: order.shippingAddress.streetName,
        address: {
          street_1: order.shippingAddress.streetName,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zip: order.shippingAddress.postalCode,
          country: order.shippingAddress.country
        }
      },
      attributes: {
        deliveryItemLastModifiedDate: shipment.value.shipmentLastModifiedDate
      },
      type: 'BOPIS',

    }
  }) : []
}

/** SHIPMENT_STATUS_MAPPING
 * if ALL shipmentDetail status == CANCELLED => shipment status = CANCELLED
 * if ANY shipmentDetail status == IN PICKING => shipment status = IN PICKING else
 * if ANY shipmentDetail status == SHIPPED => shipment status = SHIPPED else
 * if ANY shipmentDetail status == PICKUP => shipment status = PICKUP else
 * if ANY shipmentDetail status == PICKEDUP => shipment status = PICKEDUP
 */
/**
 *
 * @param {import('../orders').Shipment} shipment
 */
const getShipmentStatusMapping = (shipment) => {
  let shipmentMapping;

  const allCancelled = shipment.value.shipmentDetails.every(detail => detail.status === 'CANCELLED')
  if (allCancelled) {
    shipmentMapping = 'CANCELLED'
  }

  for (let shipmentDetail of shipment.value.shipmentDetails) {
    if (shipmentDetail.status === 'IN PICKING') {
      shipmentMapping = shipmentDetail.status
      break;
    } else if (shipmentDetail.status === 'SHIPPED') {
      shipmentMapping = shipmentDetail.status
      break;
    } else if (shipmentDetail.status === 'PICKUP') {
      shipmentMapping = shipmentDetail.status
      break;
    } else if (shipmentDetail.status === 'PICKEDUP') {
      shipmentMapping = shipmentDetail.status
      break;
    }
  }
  return shipmentMapping;
}

/**
 * @param {import('../orders').Order} order
 * @param {Array<import('../orders').Shipment>} shipments
 * @returns {Promise<import('../orders').NarvarOrder | undefined>}
 */
const convertOrderForNarvar = async (order, shipments, states) => {
  const state = order.state ? states.find(s => order.state.id === s.id) : null
  const locale = order.locale.replace('-', '_')
  const isStorePickup = (order.custom.fields.isStorePickup !== null && order.custom.fields.isStorePickup) || false
  return {
    order_info: {
      order_number: order.orderNumber,
      order_date: order.custom.fields.orderDate || order.createdAt,
      status: isStorePickup ? STATES_TO_NARVAR_PICKUP_STATUSES[state ? state.name[order.locale] : 'OPEN'] : STATES_TO_NARVAR_STATUSES[state ? state.name[order.locale] : 'OPEN'],
      currency_code: order.totalPrice.currencyCode,
      checkout_locale: locale,
      order_items: await convertItems(order, states, shipments, isStorePickup),
      shipments: convertShipments(order, shipments).filter(shipment => (filterMissingTrackingNumberMessages(shipment, order.orderNumber) && checkShipmentItemIdForNull(shipment, order.orderNumber) && checkShippedQuantity(shipment, order.orderNumber)) ? shipment : null),
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
        amount: (order.taxedPrice.totalGross.centAmount / 100.0),
        tax_amount: ((order.taxedPrice.totalGross.centAmount - order.taxedPrice.totalNet.centAmount) / 100.0),
        shipping_handling: (order.shippingInfo.shippingRate.price.centAmount / 100)
      },
      customer: {
        first_name: order.shippingAddress.firstName,
        last_name: order.shippingAddress.lastName,
        customer_id: order.custom.fields.loginRadiusUid,
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
      attributes: {
        orderLastModifiedDate: order.custom.fields.orderLastModifiedDate || order.createdAt,
        shipping_tax1: order.custom.fields.shippingTax1 ? (order.custom.fields.shippingTax1.centAmount / 100).toString() : '0',
        shipping_tax2: order.custom.fields.shippingTax2 ? (order.custom.fields.shippingTax2.centAmount / 100).toString() : '0',
        siteId: order.custom.fields.cartSourceWebsite || '00990',
        isStorePickup: isStorePickup,
        subtotal: ((order.taxedPrice.totalNet.centAmount - order.shippingInfo.shippingRate.price.centAmount) / 100).toString()
      },
      is_shoprunner_eligible: false,
    }
  }
}

module.exports = {
  convertOrderForNarvar,
  sendToNarvar,
  convertPickups,
  convertShipments,
  convertItems,
  checkShipmentItemIdForNull,
  checkShippedQuantity,
  filterMissingTrackingNumberMessages
}
