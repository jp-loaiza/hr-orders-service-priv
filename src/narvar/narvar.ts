import base64 from 'base-64'
import fetch, { RequestInit } from 'node-fetch'

const baseUrl = process.env.NARVAR_BASE_URL

const harryRosenUsername = process.env.NARVAR_USERNAME
const harryRosenpassword = process.env.NARVAR_PASSWORD

const finalCutUsername = process.env.NARVAR_USERNAME_997
const finalCutPassword = process.env.NARVAR_PASSWORD_997

const FINAL_CUT = '00997'
const enableFinalCutToNarvar = process.env.SEND_FINAL_CUT_TO_NARVAR === 'true' ? true : false

import { fetchItemInfo, fetchCategoryInfo } from '../commercetools/commercetools'
import { default as logger } from '../logger'
import {ItemState, LineItem, Order, State,} from '@commercetools/platform-sdk'
import { Shipment } from '../orders'

/**
 * @param {string} path Path to the Api
 * @param {*} options Options with the request body and authentication parameters
 * @returns Result of request if it was successful
 * @throws Error if response is not successful
 * */

const makeNarvarRequest = async (path: string, options: RequestInit | undefined) => {
  const response = await fetch(baseUrl + path, options)
  let result

  try {
    result = await response.json()
  } catch (err) {
    throw new Error(`Invalid JSON response, ${err.message}`)
  }

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

export const sendToNarvar = async (order: any) => {
  // convert order to Narvar format
  const options = {
    body: JSON.stringify(order),
    headers: {
      Authorization: `Basic ${base64.encode(harryRosenUsername + ':' + harryRosenpassword)}`,
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }

  if (shouldSendToNarvarFinalCut(order)) {
    options.headers.Authorization = `Basic ${base64.encode(finalCutUsername + ':' + finalCutPassword)}`
  }

  logger.info(`check the narvar payload: ${JSON.stringify(options.body)}`)
  return makeNarvarRequest('orders', options)
}

export const shouldSendToNarvarFinalCut = (narvarOrder: any) => narvarOrder.order_info.attributes.siteId === FINAL_CUT && enableFinalCutToNarvar

const STATES_TO_NARVAR_STATUSES /** @type {import('./orders').NarvarStateMap} */ = {
  'SHIPPED': 'SHIPPED',
  'OPEN': 'PROCESSING',
  'HOLD': 'PROCESSING',
  'IN PICKING': 'PROCESSING',
  'CANCELLED': 'CANCELLED',
  'PICKUP': 'READY_FOR_PICKUP',
  'READY_FOR_PICK_UP': 'READY_FOR_PICKUP',
  'PICKEDUP': 'PICKED_UP',
  'PICKED_UP': 'PICKED_UP'
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
  'READY_FOR_PICK_UP': 'READY_FOR_PICKUP',
  'PICKEDUP': 'PICKED_UP',
  'PICKED_UP': 'PICKED_UP'
}

type LocaleToProduct = {
  [locale: string]: string;
}

const LOCALE_TO_PRODUCT: LocaleToProduct = {
  'en-CA': 'product',
  'fr-CA': 'produit'
}

interface CarrierId {
  [key: string]: string;
}

const JESTA_CARRIER_ID_TO_NARVAR_CARRIER_ID: CarrierId = {
  'FDX': 'fedex',
  'FEDEX': 'fedex',
  'CP': 'canadapost',
  'CANADA POST': 'canadapost',
  'UPS': 'ups',
  'CANPAR': 'canpar'
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
  FEDEX: {
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
    ECONOMY: 'CP'
  },
  'CANADA POST': {
    'EXPEDITED PARCEL': 'EP',
    XPRESSPOST: 'E2',
    ECONOMY: 'CP'
  },
  UPS: {
    'EXPEDITED PARCEL': 'EX',
    ECONOMY: 'DDP'
  },
  CANPAR: {
    'EXPEDITED PARCEL': 'EXP'
  }
}

/**
 * @param {string} productSlug
 * @param {string} locale
 * @returns string
 */
export const getItemUrl = (productSlug: string, locale: string) => {
  if(!locale) {
    return undefined
  }
  return `https://harryrosen.com/${locale.substr(0, 2)}/${LOCALE_TO_PRODUCT[locale]}/${productSlug}`
}

/**
 * @param {import('../orders').ItemState} itemState
 * @param {Array<import('../orders').OrderState>} states
 * @param { 'en-CA' | 'fr-CA' } locale
 * @returns string
 */
const getItemFulfillmentStatus = (itemState: ItemState, states: State[], locale: 'en-CA' | 'fr-CA', isStorePickup: boolean) => {
  const state = states.find(s => itemState.state.id === s.id)
  if (isStorePickup) {
    //@ts-ignore
    return (state && STATES_TO_NARVAR_PICKUP_STATUSES[state.name[locale]]) ? STATES_TO_NARVAR_PICKUP_STATUSES[state.name[locale]] : 'PROCESSING'
  }
  //@ts-ignore
  return (state && STATES_TO_NARVAR_STATUSES[state.name[locale]]) ? STATES_TO_NARVAR_STATUSES[state.name[locale]] : 'PROCESSING'
}

/**
 * @param {import('../orders').LineItem} item
 * @returns {Promise<Array<string>>}
 */

async function fetchProductCategory(item: LineItem) {
  if (item.custom?.fields.category) {
    return [item.custom.fields.category]
  }
  const productDetails = await fetchItemInfo(item.productId)
  const categoryInfo = await fetchCategoryInfo(productDetails.masterData.current.categories.map(x => x.id))
  /**
   * @type {string[] | PromiseLike<string[]>}
   */
  const categoryForNarvar = categoryInfo.reduce(function (filtered: string[], x) {
    if (x.key.match('^DPMROOTCATEGORY-l1.*-l2.*-l3.*$')) filtered.push(x.name['en-CA'])
    return filtered
  }, [])
  return categoryForNarvar
}
/**
 *
 * @param {Array<{ name: string, value: any }>} attributes
 * @param {string} attrName
 * @param {{value: boolean}} attrDefault
 * @returns {{value: boolean}}
 */
const getAttributeOrDefaultBoolean = (attributes: { name: string, value: any }[] | undefined, attrName: string, attrDefault: { value: boolean }) => {
  const obj = attributes ? attributes.find(a => a.name === attrName) : undefined
  return obj ? obj : attrDefault
}

/**
 *
 * @param {Array<{ name: string, value: any }>} attributes
 * @param {string} attrName
 * @param {{value: any}} attrDefault
 * @returns {{value: any}}
 */
const getAttributeOrDefaultAny = (attributes: { name: string, value: any }[] | undefined, attrName: string, attrDefault: any) => {
  const obj = attributes ? attributes.find(a => a.name === attrName) : undefined
  return obj ? obj : attrDefault
}

/**
 *
 * @param {Array<{ name: string, value: any }>} attributes
 * @returns {string | null}
 */
const findBarcode = (attributes?: { name: string, value: any }[]) => {
  const obj = attributes ? attributes.find(a => a.name === 'barcodes') : undefined
  return obj ? obj.value.reduce((acc: any, curr: any) =>
    (acc === null || acc.obj.version < curr.obj.version) ? curr : acc).obj.value.barcode : null
}

/**
 *
 * @param {import('../orders').LineItem} item
 * @returns {number}
 */
const findUnitPrice = (item: LineItem) => {
  //@ts-ignore TODO DiscountPrice does not exist on line item issue
  return item.discountedPrice ? (item.discountedPrice.value.centAmount / 100) : item.price.value.centAmount / 100
}

/**
 *
 * @param {import('../orders').LineItem} item
 * @returns {number | null}
 */
const findDiscountedPrice = (item: LineItem) => {
  //@ts-ignore TODO DiscountPrice does not exist on line item issue
  return item.discountedPrice ? (item.discountedPrice.value.centAmount / 100) : null
}

/**
 *
 * @param {import('../orders').LineItem} item
 * @returns {number | null}
 */
const findDiscountPercent = (item: LineItem) => {
  //@ts-ignore TODO DiscountPrice does not exist on line item issue
  return item.discountedPrice ? parseFloat((((item.variant.prices[0].value.centAmount) - item.discountedPrice.value.centAmount) / (item.variant.prices[0].value.centAmount / 100)).toFixed(2)) : null
}

/**
 *
 * @param {Array<import('../orders').LineItem>} items
 * @param {string} item_id
 * @returns {string}
 */

const findItemSku = (items: LineItem[], item_id: string) => {
  const item = items.find(item => item.id === item_id)
  return item ? item.variant.sku : ''
}

/**
 *
 * @param {Array<import('../orders').Shipment>} shipments
 * @param {string} lineItemId
 * @returns {number | null}
 */

const lineNumberFromShipments = (shipments: Shipment[], lineItemId: string) => {
  const shipment = shipments.find(s => (s.value.shipmentDetails[0] && (s.value.shipmentDetails[0].lineItemId === lineItemId)))
  return shipment ? shipment.value.shipmentDetails[0].line : null
}

/**
 *
 * @param {import('../orders').NarvarShipment} shipment
 * @param {string} order_number
 * @returns {boolean}
 */

export function filterMissingTrackingNumberMessages(id: string, tracking_number: string | null, order_number?: string) {
  if (!tracking_number) {
    console.error(`Shipment ${id} for non-BOPIS order ${order_number} has no tracking number`)
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

export function checkShipmentItemIdForNull(item_id: string, order_number?: string) {
  if (!item_id) {
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

export function checkShippedQuantity(quantity: number, order_number?: string) {
  if (!quantity || quantity === 0) {
    // we also want to skip messages with quantity = 0. We log out a message here for alerting purposes
    console.error(`Cannot process messages with quantity shipped = 0. Order number: ${order_number}`)
    return false
  }
  return true
}

/**
 *
 * @param {Array<import('../orders').Shipment>} shipments
 * @param {string} lineItemId
 * @returns {string | null}
 */

const shipmentItemLastModifiedDateFromShipments = (shipments: Shipment[], lineItemId: string) => {
  const shipment = shipments.find(s => (s.value.shipmentDetails[0] && (s.value.shipmentDetails[0].lineItemId === lineItemId)))
  return shipment && shipment.value.shipmentItemLastModifiedDate ? shipment.value.shipmentItemLastModifiedDate : null
}

interface ReasonCode {
  [key: string]: string;
}

const ORDER_REASON_CODE : ReasonCode = {
  'ORDER_FRAUD_FAILURE' : '5', //Fraud - Order Declined will not be filled
  'ORDER_CUSTOMER_REMORSE' : '1', //Client Request - Ordered Wrong Item
  'ORDER_CUSTOMER_REQUEST' : '2', //Client Request - Changed Mind / Not Needed
  'ORDER_NO_INVENTORY' : '3', // Can Not Fill - Items damaged
  'ORDER_NO_MORE_INVENTORY' : '4', //Can Not Fill - Inventory Error
}

const ORDER_ITEM_REASON_CODE : ReasonCode = {
  'ORDER_DETAIL_CLIENT_REQUEST' : '1', //Client Request - Ordered Wrong Item
  'ORDER_DETAIL_NO_MORE_INVENTORY' : '3', //Can Not Fill - Items damaged
  'ORDER_DETAIL_FRAUD_FAILURE' : '5', //Fraud - Order Declined will not be filled
  'ORDER_DETAIL_CUSTOMER_REMORSE' : '2', //Client Request - Changed Mind / Not Needed
  'ORDER_DETAIL_NO_INVENTORY' : '4', //Can Not Fill - Inventory Error
}

/**
 *
 *
 * @param item {import('../orders').LineItem}
 * @param order {import('../orders').Order} order
 */
function getReasonCode(item: LineItem, order: Order) {
  if(item.custom?.fields.reasonCode) {
    return ORDER_REASON_CODE[item.custom?.fields.reasonCode as string] ||
        ORDER_ITEM_REASON_CODE[item.custom?.fields.reasonCode as string] ||
        item.custom?.fields.reasonCode
  }

  if(order.custom?.fields.reasonCode) {
    return ORDER_REASON_CODE[order.custom?.fields.reasonCode as string] ||
        ORDER_ITEM_REASON_CODE[order.custom?.fields.reasonCode as string] ||
        order.custom?.fields.reasonCode
  }
  return null;
}

async function getNarvarLineItem(item: LineItem, locale: "en-CA" | "fr-CA", itemState: ItemState, states: State[], isStorePickup: boolean, order: Order, shipments: Shipment[], lineCounter: number, isUniqueState: boolean, index: number) {
  const categories = await fetchProductCategory(item)
  const itemStateKey = states.find(state => state.id === itemState.state.id)?.key
  const lineItem = {
    item_id: isUniqueState || itemStateKey !== 'canceledLineItemStatus' ? item.id : item.id + '-' + index,
    sku: item.variant.sku,
    name: item.name[locale],
    quantity: itemState.quantity,
    categories,
    unit_price: findUnitPrice(item),
    discount_amount: findDiscountedPrice(item),
    discount_percent: findDiscountPercent(item),
    item_image: item.variant.images ? item.variant.images[0].url : undefined,
    item_url: item.productSlug ? getItemUrl(item.productSlug[locale], locale) : undefined,
    is_final_sale: !getAttributeOrDefaultBoolean(item.variant.attributes, 'isReturnable', {value: true}).value,
    fulfillment_status: getItemFulfillmentStatus(itemState, states, locale, isStorePickup),
    fulfillment_type: order.custom?.fields.isStorePickup ? 'BOPIS' : 'HD',
    is_gift: item.custom?.fields.isGift,
    final_sale_date: order.custom?.fields.orderCreatedDate || order.createdAt,
    line_number: lineNumberFromShipments(shipments, item.id) || lineCounter,
    attributes: {
      on_sale: getAttributeOrDefaultBoolean(item.variant.attributes, 'onSale', {value: false}).value,
      orderItemLastModifiedDate: item.custom?.fields.orderDetailLastModifiedDate || order.createdAt,
      brand_name: getAttributeOrDefaultAny(item.variant.attributes, 'brandName', {value: {[locale]: null}}).value[locale],
      barcode: findBarcode(item.variant.attributes),
      size: getAttributeOrDefaultAny(item.variant.attributes, 'size', {value: {[locale]: null}}).value[locale],
      reasonCode: getReasonCode(item, order),
      deliveryItemLastModifiedDate: shipmentItemLastModifiedDateFromShipments(shipments, item.id) || item.custom?.fields.orderDetailLastModifiedDate
    },
    vendors: [{'name': getAttributeOrDefaultBoolean(item.variant.attributes, 'isEndlessAisle', {value: false}).value ? 'EA' : 'HR'}],
    line_price: (item.totalPrice.centAmount / 100),
    product_type: getAttributeOrDefaultAny(item.variant.attributes, 'productType', {value: null}).value,
    product_id: item.productId,
    dimensions: null,
    is_backordered: null,
    vendor: null,
    item_promise_date: null,
    return_reason_code: null,
    events: null,
    color: getAttributeOrDefaultAny(item.variant.attributes, 'colour', {value: {[locale]: null}}).value[locale],
    size: getAttributeOrDefaultAny(item.variant.attributes, 'size', {value: {[locale]: null}}).value[locale],
    //style: getAttributeOrDefaultAny(item.variant.attributes, 'styleAndMeasurements', { value: { [locale] : null } }).value[locale],
    original_unit_price: item.variant.attributes ? item.variant.attributes.find(({name}) => (name === 'originalPrice'))?.value.centAmount / 100 : null,
    original_line_price: null,
    narvar_convert_id: null
  };
  return lineItem
}

/**
 *
 * @param {import('../orders').Order} order
 * @param {Array<import('../orders').OrderState>} states
 * @param {Array<import('../orders').Shipment>} shipments
 * @returns {Promise<Array<import('../orders').NarvarOrderItem>>}
 */
export const convertItems = async (
  order: Order,
  states: State[],
  shipments: Shipment[],
  isStorePickup: boolean) => {
  const locale = order.locale as 'en-CA' | 'fr-CA'
  let lineCounter = 1;

  const items = await Promise.all(order.lineItems.flatMap(async (item) => {
    return await Promise.all(item.state.map(async (itemState, index) => {
      const isUniqueState = item.state.length === 1
      return await getNarvarLineItem(item, locale, itemState, states, isStorePickup, order, shipments, lineCounter++, isUniqueState, index)
    }))


  }))
  return items.flat()
}

/**
 *
 * @param {import('../orders').Order} order
 * @param {Array<import('../orders').Shipment>} shipments
 * @returns {Array<import('../orders').NarvarShipment>}
 */

export const convertShipments = (order: Order, shipments: Shipment[]) => {
  return !order.custom?.fields.isStorePickup && shipments.length ? shipments.filter(shipment => getShipmentStatusMapping(shipment) === 'SHIPPED').map(shipment => {
    const carrierId = shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].carrierId || undefined
    return {
      id: shipment.id,
      carrier: carrierId ? JESTA_CARRIER_ID_TO_NARVAR_CARRIER_ID[carrierId] : null, // carrier
      tracking_number: shipment.value.shipmentDetails.filter(shipmentDetail => shipmentDetail.quantityShipped > 0)[0].trackingNumber || null, // tracking number
      //@ts-ignore
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
        first_name: order.shippingAddress?.firstName,
        last_name: order.shippingAddress?.lastName,
        phone: order.shippingAddress?.phone,
        email: order.shippingAddress?.email,
        address: {
          street_1: order.shippingAddress?.streetName,
          city: order.shippingAddress?.city,
          state: order.shippingAddress?.state,
          zip: order.shippingAddress?.postalCode,
          country: order.shippingAddress?.country
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
export const convertPickups = (order: Order, shipments: Shipment[]) => {
  return order.custom?.fields.isStorePickup && shipments.length
    ? shipments
          .filter(shipment => {
            const shipmentStatusMapping = getShipmentStatusMapping(shipment)
            return shipmentStatusMapping &&
                ["PICKUP", "PICKEDUP", "PICKED_UP", "READY_FOR_PICK_UP"].includes(shipmentStatusMapping)
          })
          .map(shipment => {
        const shipmentStatus = getShipmentStatusMapping(shipment)
        return {
          id: shipment.id,
          status: {
            //@ts-ignore
            code: shipmentStatus ? STATES_TO_NARVAR_PICKUP_STATUSES[shipmentStatus] : null,
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
            id: order.custom?.fields.destinationSiteId || '',
            phone_number: order.shippingAddress?.phone,
            name: order.shippingAddress?.streetName,
            address: {
              street_1: order.shippingAddress?.streetName,
              city: order.shippingAddress?.city,
              state: order.shippingAddress?.state,
              zip: order.shippingAddress?.postalCode,
              country: order.shippingAddress?.country
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
const getShipmentStatusMapping = (shipment: Shipment) => {
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
    } else if (shipmentDetail.status === 'PICKED_UP') {
      shipmentMapping = shipmentDetail.status
      break;
    } else if (shipmentDetail.status === 'READY_FOR_PICK_UP') {
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
export const convertOrderForNarvar = async (order: Order, shipments: Shipment[], states: State[]) => {
  const state = order.state ? states.find(s => order.state?.id === s.id) : null
  const locale = order.locale?.replace('-', '_')
  const isStorePickup = (order.custom?.fields.isStorePickup !== null && order.custom?.fields.isStorePickup) || false
  return {
    order_info: {
      order_number: order.orderNumber,
      order_date: order.custom?.fields.orderDate || order.createdAt,
      //@ts-ignore
      status: isStorePickup ? STATES_TO_NARVAR_PICKUP_STATUSES[state ? state.name[order.locale] : 'OPEN'] : STATES_TO_NARVAR_STATUSES[state ? state.name[order.locale] : 'OPEN'],
      currency_code: order.totalPrice.currencyCode,
      checkout_locale: locale,
      order_items: await convertItems(order, states, shipments, isStorePickup),
      shipments: convertShipments(order, shipments).filter(shipment => (filterMissingTrackingNumberMessages(shipment.id, shipment.tracking_number, order.orderNumber)
        && checkShipmentItemIdForNull(shipment.items_info[0].item_id, order.orderNumber)
        && checkShippedQuantity(shipment.items_info[0].quantity, order.orderNumber)) ? shipment : null),
      pickups: convertPickups(order, shipments),
      billing: {
        billed_to: {
          first_name: order.billingAddress?.firstName,
          last_name: order.billingAddress?.lastName,
          phone: order.billingAddress?.phone,
          email: order.billingAddress?.email,
          address: {
            street_1: order.billingAddress?.streetName,
            city: order.billingAddress?.city,
            state: order.billingAddress?.state,
            zip: order.billingAddress?.postalCode,
            country: order.billingAddress?.country
          },
        },
        amount: ((order.taxedPrice?.totalGross.centAmount ?? 0) / 100.0),
        tax_amount: ((order.taxedPrice?.taxPortions.reduce((accumulator, currentValue) => accumulator + currentValue.amount.centAmount, 0) || 0) / 100.0),
        shipping_handling: ((order.shippingInfo?.shippingRate.price.centAmount ?? 0) / 100)
      },
      customer: {
        first_name: order.shippingAddress?.firstName,
        last_name: order.shippingAddress?.lastName,
        customer_id: order.custom?.fields.loginRadiusUid,
        phone: order.shippingAddress?.phone,
        email: order.shippingAddress?.email,
        address: {
          street_1: order.shippingAddress?.streetName,
          city: order.shippingAddress?.city,
          state: order.shippingAddress?.state,
          zip: order.shippingAddress?.postalCode,
          country: order.shippingAddress?.country
        },
        wasAuthenticated: order.custom?.fields.wasAuthenticated ? 'true' : 'false',
        loyaltyTier: order.custom?.fields.loyaltyTier
      },
      attributes: {
        orderLastModifiedDate: order.custom?.fields.orderLastModifiedDate || order.createdAt,
        shipping_tax1: order.custom?.fields.shippingTax1 ? (order.custom.fields.shippingTax1.centAmount / 100).toString() : '0',
        shipping_tax2: order.custom?.fields.shippingTax2 ? (order.custom.fields.shippingTax2.centAmount / 100).toString() : '0',
        siteId: order.custom?.fields.cartSourceWebsite || '00990',
        isStorePickup: isStorePickup,
        subtotal: (((order.taxedPrice?.totalNet.centAmount ?? 0) - (order.shippingInfo?.shippingRate.price.centAmount ?? 0)) / 100).toString()
      },
      is_shoprunner_eligible: false,
    }
  }
}
