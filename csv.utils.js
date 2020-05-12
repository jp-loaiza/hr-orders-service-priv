const { CARRIER_NAMES_TO_IDS, SHIPPING_SERVICE_TYPES } = require('./constants')

/** 
 * @param {string} shippingMethodName
 * @info The string should be of the form `${carrier} ${shippingMethod}`. For
 *       example, 'FedEx Express'.
 * */
const getServiceTypeFromShippingMethodName = shippingMethodName => {
  const [, serviceDescription] = shippingMethodName.split(' ')
  // @ts-ignore
  return SHIPPING_SERVICE_TYPES[serviceDescription.toUpperCase()]
}

/** 
 * @param {string} shippingMethodName
 * */
const getCarrierIdFromShippingMethodName = shippingMethodName => {
  const [carrierName] = shippingMethodName.split(' ')
  // @ts-ignore
  return CARRIER_NAMES_TO_IDS[carrierName]
}

/** 
 * @param {string} shippingMethodName
 * */
const shippingMethodIsRushShipping = shippingMethodName => {
  const serviceType = getServiceTypeFromShippingMethodName(shippingMethodName)
  return serviceType === SHIPPING_SERVICE_TYPES.EXPRESS
    || serviceType === SHIPPING_SERVICE_TYPES.EXPEDITED_PARCEL
    || serviceType === SHIPPING_SERVICE_TYPES.XPRESSPOST
}

/**
 * @param {{ lineItems: Array<import('./orders').LineItem> }} order 
 */
const getLineItemTotalTax = order => (
  order.lineItems.reduce((totalTax, lineItem) => (
    totalTax + (lineItem.taxedPrice.totalGross.centAmount - lineItem.price.value.centAmount)), 0
  )
)

/**
 * @param {import('./orders').ShippingInfo} shippingInfo
 */
const getShippingTotalTax = shippingInfo => shippingInfo.taxedPrice.totalGross.centAmount - shippingInfo.price.centAmount

/**
 * @param {{ shippingInfo: import('./orders').ShippingInfo, lineItems: Array<import('./orders').LineItem>}} order
 */
const getOrderTotalTax = order => getLineItemTotalTax(order) + getShippingTotalTax(order.shippingInfo)

/**
 * @param {number} cents 
 * @explain CT stores prices in cents, but JESTA expects them to be given in dollars
 */
const convertToDollars = cents => {
  const exactDollars = cents / 100
  const roundedDollars = Math.round(exactDollars * 100) / 100
  return roundedDollars
}

/**
 * @param {string} jsonDateString 
 * @explain CT dates are JSON dates, but JESTA expects dates to be of the form `yyyy-MM-dd HH24:MI`
 */
const formatDate = jsonDateString => (
  jsonDateString.slice(0, 10) + ' ' + jsonDateString.slice(11, 16)
)

module.exports = {
  convertToDollars,
  formatDate,
  getCarrierIdFromShippingMethodName,
  getOrderTotalTax,
  getServiceTypeFromShippingMethodName,
  getShippingTotalTax,
  shippingMethodIsRushShipping
}
