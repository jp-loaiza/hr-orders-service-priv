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
    id: order.id,
    order_number: order.orderNumber,
    order_state: order.orderState,
    shipment_state: order.shipmentState,
    created_at: order.createdAt,
    modified_at: order.lastModifiedAt,
    first_name: order.shippingAddress.firstName,
    last_name: order.shippingAddress.lastName,
    loginradius_id: order.custom.fields.loginRadiusUid,
    email: order.shippingAddress.email,
    phone_number: order.shippingAddress.phone,
    total: ((order.taxedPrice.totalNet.centAmount - order.shippingInfo.shippingRate.price.centAmount) / 100),
    revenue: (order.taxedPrice.totalGross.centAmount / 100.0),
    shipping_cost: (order.shippingInfo.shippingRate.price.centAmount / 100),
    shipping_method: order.shippingInfo.shippingMethodName,
    is_store_pickup: isStorePickup,
    payment_method: order.paymentInfo.payments[0].obj.custom.fields.transaction_card_type,
    local: order.locale.replace('-', '_'),
    currency_code: order.totalPrice.currencyCode,
    user_agent: order.paymentInfo.payments[0].obj.custom.fields.user_agent_string,
    tax: ((order.taxedPrice.totalGross.centAmount - order.taxedPrice.totalNet.centAmount)),
    discount: getTotalDiscountAmount(order.lineItems),
    coupon_code: order.discountCodes,
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
      }
    },
    products: await convertItems(order, states, shipments, isStorePickup),
    shipments: convertShipments(order, shipments).filter(shipment => (filterMissingTrackingNumberMessages(shipment, order.orderNumber) && checkShipmentItemIdForNull(shipment, order.orderNumber) && checkShippedQuantity(shipment, order.orderNumber)) ? shipment : null),
    pickups: convertPickups(order, shipments),
    order
  }
  return orderData
}

module.exports = {
  getOrderData
}
