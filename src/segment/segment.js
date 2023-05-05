//Commercetools Functions
const { fetchShipments, fetchStates } = require('../commercetools/commercetools')

//Reutilizing Narvar Functions
const { convertItems, convertPickups, convertShipments, checkShipmentItemIdForNull, checkShippedQuantity, filterMissingTrackingNumberMessages } = require('../narvar/narvar')

/**
 * 
 * @param {Array<import('../orders.d').LineItem>}  lineItems order to send to Narvar
 * @returns number
 */

const getTotalDiscountAmount = async (lineItems) => {
  var /** @type number */ total = 0
  var /** @type number */ discountPrice = 0
  for (const item of lineItems) {
    total = total + item.totalPrice.centAmount
    item.discountedPrice ? discountPrice = discountPrice + item.discountedPrice.value.centAmount : total
  }
  return (total - discountPrice) / 100
};

/**
 * @param {import('@commercetools/platform-sdk').Address} address
 */
const formatAddressForSegment = (address) => ({
  zip: address.postalCode,
  company: address.company,
  country: address.country,
  province: address.state,
  address1: address.streetName,
  address2: address.additionalAddressInfo,
  city: address.city,
  first_name: address.firstName,
  last_name: address.lastName,
  phone: address.phone,
  email: address.email
})

/**
 * @param {import('@commercetools/platform-sdk').Order} order
 */
const getOrderData = async (order) => {
  const shipments = await fetchShipments(order.orderNumber)
  const states = await fetchStates()
  const isStorePickup = (order.custom.fields.isStorePickup !== null && order.custom.fields.isStorePickup) || false
  const storeId = order.custom.fields.cartSourceWebsite || '00990'
  const orderData = {
    store_id: order.custom.fields.cartSourceWebsite || '00990',
    storefront_name: (storeId === '0990') ? 'retail' : 'outlet',
    source: 'online',
    cart_id: order.id,
    order_id: order.orderNumber,
    order_state: order.orderState,
    shipment_state: order.shipmentState,
    modified_at: order.lastModifiedAt,
    first_name: order.shippingAddress.firstName,
    last_name: order.shippingAddress.lastName,
    loginradius_id: order.custom.fields.loginRadiusUid,
    email: order.shippingAddress.email,
    phone: order.shippingAddress.phone,
    total: ((order.taxedPrice.totalNet.centAmount - order.shippingInfo.shippingRate.price.centAmount) / 100),
    revenue: (order.taxedPrice.totalGross.centAmount / 100.0),
    shipping: (order.shippingInfo.shippingRate.price.centAmount / 100),
    shipping_method: order.shippingInfo.shippingMethodName,
    bopis: isStorePickup,
    gtag_session_id: order.custom.fields.gtagSessionId || null,
    gtag_session_number: order.custom.fields.gtagSessionNumber || null,
    gtag_client_id: order.custom.fields.gtagClientId || null,
    payment_method: order.paymentInfo.payments[0].obj.custom.fields.transaction_card_type,
    local: order.locale.replace('-', '_'),
    currency: order.totalPrice.currencyCode,
    user_agent: order.paymentInfo.payments[0].obj.custom.fields.user_agent_string,
    tax: (order.taxedPrice.totalGross.centAmount - order.taxedPrice.totalNet.centAmount) / 100.0,
    discount: getTotalDiscountAmount(order.lineItems),
    coupon: order.discountCodes,
    subtotal: order.lineItems.reduce((result, lineItem) => {
      return result + lineItem.quantity * lineItem.price.value.centAmount / 100.0
    }, 0),
    billing_address: formatAddressForSegment(order.billingAddress),
    shipping_address: formatAddressForSegment(order.shippingAddress),
    products: await convertItems(order, states, shipments, isStorePickup),
    shipments: convertShipments(order, shipments).filter(shipment => (filterMissingTrackingNumberMessages(shipment, order.orderNumber) && checkShipmentItemIdForNull(shipment, order.orderNumber) && checkShippedQuantity(shipment, order.orderNumber)) ? shipment : null),
    pickups: convertPickups(order, shipments),
  }
  return orderData
}

module.exports = {
  getOrderData
}
