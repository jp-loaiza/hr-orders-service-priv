const {
  CARRIER_NAMES_TO_IDS,
  CT_PAYMENT_STATES,
  DETAILS_ROWS_ENUM,
  HEADER_ROWS_ENUM,
  LOCALES_TO_JESTA_LANGUAGE_NUMBERS,
  ONLINE_SITE_ID,
  SHIPPING_SERVICE_TYPES,
  TAXES_ROWS_ENUM
} = require('./constants')

// TODO: Validate values. Some things to check:
//  - Countries must be two characters
//  - States must be two characters
//  - ORDER_DATE must be of the form `yyyy-MM-dd HH24:MI`
//  - CARRIER_ID must be one of ['CP', 'FDX', 'PRL', 'DHL', 'USPS', 'UPS']
//  - SERVICE_TYPE must be one of  ['EXPRESS', 'SHIPMENT', 'EXPEDITED PARCEL', 'XPRESSPOST']
// TODO: Figure out whether `SHIPPING_TAX2` is required, and if so what to put for it

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
 * @explain CT stores prices in cents, but JESTA expects them to be given in dollars.
 */
const convertToDollars = cents => {
  const unroundedDollars = cents / 100
  return unroundedDollars // TODO: do proper rounding
}

/**
 * @param {import('./orders').Order} order 
 * @explain Maps the CT order object to another object which we'll use to
 *          generate the "Header records" part of the CSV.
 */
const getHeaderObjectFromOrder = ({
  billingAddress,
  createdAt,
  customerEmail,
  customerId,
  lineItems,
  locale,
  orderNumber,
  paymentState,
  shippingAddress,
  shippingInfo,
  totalPrice
}) => ({
  [HEADER_ROWS_ENUM.RECORD_TYPE]: 'H',
  [HEADER_ROWS_ENUM.SITE_ID]: ONLINE_SITE_ID,
  [HEADER_ROWS_ENUM.WFE_TRANS_ID]: orderNumber,
  [HEADER_ROWS_ENUM.SHIP_TO_FIRST_NAME]: shippingAddress.firstName,
  [HEADER_ROWS_ENUM.SHIP_TO_LAST_NAME]: shippingAddress.lastName,
  [HEADER_ROWS_ENUM.SHIP_TO_ADDRESS_1]: shippingAddress.additionalStreetInfo.split('\n')[0],
  [HEADER_ROWS_ENUM.SHIP_TO_ADDRESS_2]: shippingAddress.additionalStreetInfo.split('\n')[1],
  [HEADER_ROWS_ENUM.SHIP_TO_CITY]: shippingAddress.city,
  [HEADER_ROWS_ENUM.SHIP_TO_STATE_ID]: shippingAddress.state,
  [HEADER_ROWS_ENUM.SHIP_TO_ZIP_CODE]: shippingAddress.postalCode,
  [HEADER_ROWS_ENUM.SHIP_TO_COUNTRY_ID]: shippingAddress.country,
  [HEADER_ROWS_ENUM.WFE_CUSTOMER_ID]: customerId,
  [HEADER_ROWS_ENUM.BILL_TO_FIRST_NAME]: billingAddress.firstName,
  [HEADER_ROWS_ENUM.BILL_TO_LAST_NAME]: billingAddress.lastName,
  [HEADER_ROWS_ENUM.BILL_TO_ADDRESS_1]: billingAddress.additionalStreetInfo.split('\n')[0],
  [HEADER_ROWS_ENUM.BILL_TO_ADDRESS_2]: billingAddress.additionalStreetInfo.split('\n')[1],
  [HEADER_ROWS_ENUM.BILL_TO_CITY]: billingAddress.city,
  [HEADER_ROWS_ENUM.BILL_TO_STATE_ID]: billingAddress.state,
  [HEADER_ROWS_ENUM.BILL_TO_ZIP_CODE]: billingAddress.postalCode,
  [HEADER_ROWS_ENUM.BILL_TO_COUNTRY_ID]: billingAddress.country,
  [HEADER_ROWS_ENUM.BILL_TO_HOME_PHONE]: billingAddress.phone || shippingAddress.phone, // From JESTA's docs: "Both [BILL_TO_HOME_PHONE and SHIP_TO_HOME_PHONE] are copied from this field"
  [HEADER_ROWS_ENUM.EMAIL_ADDRESS]: customerEmail,
  [HEADER_ROWS_ENUM.CARRIER_ID]: getCarrierIdFromShippingMethodName(shippingInfo.shippingMethodName),
  [HEADER_ROWS_ENUM.RUSH_SHIPPING_IND]: shippingMethodIsRushShipping(shippingInfo.shippingMethodName) ? 'Y' : 'N',
  [HEADER_ROWS_ENUM.SHIP_COMPLETE_IND]: 'N',
  [HEADER_ROWS_ENUM.SHIPPING_CHARGES_TOTAL]: convertToDollars(shippingInfo.shippingRate.price.centAmount),
  [HEADER_ROWS_ENUM.TAX_TOTAL]: convertToDollars(getOrderTotalTax({lineItems, shippingInfo})),
  [HEADER_ROWS_ENUM.TRANSACTION_TOTAL]: convertToDollars(totalPrice.centAmount),
  [HEADER_ROWS_ENUM.ORDER_DATE]: createdAt,
  [HEADER_ROWS_ENUM.SHIPPING_TAX1]: convertToDollars(getShippingTotalTax(shippingInfo)),
  [HEADER_ROWS_ENUM.SHIPPING_TAX1_DESCRIPTION]: shippingInfo.taxRate.name,
  [HEADER_ROWS_ENUM.SHIPPING_TAX3]: 0, // Required. From JESTA's docs: "Not Used, Default to 0".
  [HEADER_ROWS_ENUM.REQUESTER_SITE_ID]: ONLINE_SITE_ID,
  [HEADER_ROWS_ENUM.SERVICE_TYPE]: getServiceTypeFromShippingMethodName(shippingInfo.shippingMethodName),
  // @ts-ignore
  [HEADER_ROWS_ENUM.LANGUAGE_NO]: LOCALES_TO_JESTA_LANGUAGE_NUMBERS[locale],
  [HEADER_ROWS_ENUM.RELEASED]: (paymentState === CT_PAYMENT_STATES.PAID || paymentState === CT_PAYMENT_STATES.CREDIT_OWED) ? 'Y' : 'N'
})

const getDetailsObjectFromOrderAndLineItem = (/** @type {import('./orders').Order} */ order) => (/** @type {import('./orders').LineItem} */ lineItem) => ({
  [DETAILS_ROWS_ENUM.RECORD_TYPE]: 'D',
  [DETAILS_ROWS_ENUM.SITE_ID]: ONLINE_SITE_ID,
  [DETAILS_ROWS_ENUM.LINE]: lineItem.id, // Still TBD whether this will have to change
  [DETAILS_ROWS_ENUM.WFE_TRANS_ID]: order.orderNumber,
  [DETAILS_ROWS_ENUM.QTY_ORDERED]: lineItem.quantity,
  [DETAILS_ROWS_ENUM.UNIT_PRICE]: convertToDollars(lineItem.price.value.centAmount),
  [DETAILS_ROWS_ENUM.EXTENSION_AMOUNT]: convertToDollars(lineItem.quantity * lineItem.price.value.centAmount),
  [DETAILS_ROWS_ENUM.LINE_SHIPPING_CHARGES]: 0, // TODO: confirm what goes here
  [DETAILS_ROWS_ENUM.LINE_TOTAL_TAX]: convertToDollars(lineItem.taxedPrice.totalGross.centAmount - lineItem.price.value.centAmount),
  [DETAILS_ROWS_ENUM.LINE_TOTAL_AMOUNT]: convertToDollars(lineItem.taxedPrice.totalGross.centAmount),
  [DETAILS_ROWS_ENUM.BAR_CODE_ID]: lineItem.custom.fields.barcodeData[0].obj.value.barcode,
  [DETAILS_ROWS_ENUM.ENDLESS_AISLE_IND]: 'N',
  [DETAILS_ROWS_ENUM.EXT_REF_ID]: undefined, // Still TBD what goes here
  [DETAILS_ROWS_ENUM.GIFT_WRAP_IND]: lineItem.custom.fields.isGift,
  [DETAILS_ROWS_ENUM.SUB_TYPE]: lineItem.custom.fields.barcodeData[0].obj.value.subType
})

const getTaxesObjectFromOrderAndLineItem = (/** @type {import('./orders').Order} */ order) => (/** @type {import('./orders').LineItem} */ lineItem) => ({
  [TAXES_ROWS_ENUM.RECORD_TYPE]: 'T',
  [TAXES_ROWS_ENUM.SITE_ID]: ONLINE_SITE_ID,
  [TAXES_ROWS_ENUM.LINE]: lineItem.id, // Still TBD whether this will have to change
  [TAXES_ROWS_ENUM.WFE_TRANS_ID]: order.orderNumber,
  [TAXES_ROWS_ENUM.SITE_ID]: 1, // From JESTA's docs: "1 if one tax. 1 and 2 if two tax lines"
  [TAXES_ROWS_ENUM.MERCHANDISE_TAX_AMOUNT]: convertToDollars(lineItem.taxedPrice.totalGross.centAmount - lineItem.price.value.centAmount),
  [TAXES_ROWS_ENUM.MERCHANDISE_TAX_DESC]: lineItem.taxRate.name
})

module.exports = {
  getHeaderObjectFromOrder,
  getDetailsObjectFromOrderAndLineItem,
  getTaxesObjectFromOrderAndLineItem
}
