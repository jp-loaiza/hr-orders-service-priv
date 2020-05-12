const { parse } = require('json2csv')

const {
  CT_PAYMENT_STATES,
  DETAILS_ROWS,
  DETAILS_ROWS_ENUM,
  GENERAL_CSV_OPTIONS,
  HEADER_ROWS,
  HEADER_ROWS_ENUM,
  LOCALES_TO_JESTA_LANGUAGE_NUMBERS,
  MISC_ROWS,
  ONLINE_SITE_ID,
  TAXES_ROWS,
  TAXES_ROWS_ENUM,
  TENDER_ROWS,
  TENDER_ROWS_ENUM
} = require('./constants')
const  {
  convertToDollars,
  formatDate,
  getCarrierIdFromShippingMethodName,
  getOrderTotalTax,
  getServiceTypeFromShippingMethodName,
  getShippingTotalTax,
  shippingMethodIsRushShipping
} = require('./csv.utils')

// The following group of functions turn the CT order object into objects that
// we can feed into the CSV generator to create the CSV

/**
 * @param {import('./orders').Order} order 
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
  [HEADER_ROWS_ENUM.SHIPPING_CHARGES_TOTAL]: convertToDollars(shippingInfo.taxedPrice.totalGross.centAmount),
  [HEADER_ROWS_ENUM.TAX_TOTAL]: convertToDollars(getOrderTotalTax({ lineItems, shippingInfo })),
  [HEADER_ROWS_ENUM.TRANSACTION_TOTAL]: convertToDollars(totalPrice.centAmount),
  [HEADER_ROWS_ENUM.ORDER_DATE]: formatDate(createdAt),
  [HEADER_ROWS_ENUM.SHIPPING_TAX1]: convertToDollars(getShippingTotalTax(shippingInfo)),
  [HEADER_ROWS_ENUM.SHIPPING_TAX1_DESCRIPTION]: shippingInfo.taxRate.name,
  [HEADER_ROWS_ENUM.REQUESTER_SITE_ID]: ONLINE_SITE_ID,
  [HEADER_ROWS_ENUM.SERVICE_TYPE]: getServiceTypeFromShippingMethodName(shippingInfo.shippingMethodName),
  // @ts-ignore
  [HEADER_ROWS_ENUM.LANGUAGE_NO]: LOCALES_TO_JESTA_LANGUAGE_NUMBERS[locale],
  [HEADER_ROWS_ENUM.RELEASED]: (paymentState === CT_PAYMENT_STATES.PAID || paymentState === CT_PAYMENT_STATES.CREDIT_OWED) ? 'Y' : 'N'
})

const getDetailsObjectFromOrderAndLineItem = (/** @type {import('./orders').Order} */ order) => (/** @type {import('./orders').LineItem} */ lineItem, /** @type {number} */ index) => ({
  [DETAILS_ROWS_ENUM.RECORD_TYPE]: 'D',
  [DETAILS_ROWS_ENUM.SITE_ID]: ONLINE_SITE_ID,
  [DETAILS_ROWS_ENUM.LINE]: index + 1,
  [DETAILS_ROWS_ENUM.WFE_TRANS_ID]: order.orderNumber,
  [DETAILS_ROWS_ENUM.QTY_ORDERED]: lineItem.quantity,
  [DETAILS_ROWS_ENUM.UNIT_PRICE]: convertToDollars(lineItem.price.value.centAmount),
  [DETAILS_ROWS_ENUM.EXTENSION_AMOUNT]: convertToDollars(lineItem.quantity * lineItem.price.value.centAmount),
  [DETAILS_ROWS_ENUM.LINE_SHIPPING_CHARGES]: 0, // TODO: confirm what goes here
  [DETAILS_ROWS_ENUM.LINE_TOTAL_TAX]: convertToDollars(lineItem.taxedPrice.totalGross.centAmount - lineItem.price.value.centAmount),
  [DETAILS_ROWS_ENUM.LINE_TOTAL_AMOUNT]: convertToDollars(lineItem.taxedPrice.totalGross.centAmount),
  [DETAILS_ROWS_ENUM.BAR_CODE_ID]: lineItem.custom.fields.barcodeData[0].obj.value.barcode,
  [DETAILS_ROWS_ENUM.ENDLESS_AISLE_IND]: 'N',
  [DETAILS_ROWS_ENUM.EXT_REF_ID]: lineItem.id, // Still TBD whether this will have to change
  [DETAILS_ROWS_ENUM.GIFT_WRAP_IND]: lineItem.custom.fields.isGift ? 'Y' : 'N',
  [DETAILS_ROWS_ENUM.SUB_TYPE]: lineItem.custom.fields.barcodeData[0].obj.value.subType
})

const getTaxesObjectFromOrderAndLineItem = (/** @type {import('./orders').Order} */ order) => (/** @type {import('./orders').LineItem} */ lineItem, /** @type {number} */ index) => ({
  [TAXES_ROWS_ENUM.RECORD_TYPE]: 'T',
  [TAXES_ROWS_ENUM.SITE_ID]: ONLINE_SITE_ID,
  [TAXES_ROWS_ENUM.LINE]: index + 1,
  [TAXES_ROWS_ENUM.WFE_TRANS_ID]: order.orderNumber,
  [TAXES_ROWS_ENUM.SITE_ID]: 1, // From JESTA's docs: "1 if one tax. 1 and 2 if two tax lines"
  [TAXES_ROWS_ENUM.MERCHANDISE_TAX_AMOUNT]: convertToDollars(lineItem.taxedPrice.totalGross.centAmount - lineItem.price.value.centAmount),
  [TAXES_ROWS_ENUM.MERCHANDISE_TAX_DESC]: lineItem.taxRate.name
})

const getTenderObjectFromOrderAndPaymentInfoItem = (/** @type {import('./orders').Order} */ order) => (/** @type {import('./orders').PaymentInfo} */ paymentInfo, /** @type {number} */ index) => ({
  [TENDER_ROWS_ENUM.RECORD_TYPE]: 'N',
  [TENDER_ROWS_ENUM.SITE_ID]: ONLINE_SITE_ID,
  [TENDER_ROWS_ENUM.LINE]: index + 1, // From JESTA's docs: "Always 1 if 1 tender method. Increment if multiple tenders used"
  [TENDER_ROWS_ENUM.WFE_TRANS_ID]: order.orderNumber,
  [TENDER_ROWS_ENUM.AMOUNT]: convertToDollars(paymentInfo.amountPlanned.centAmount),
  [TENDER_ROWS_ENUM.POS_EQUIVALENCE]: paymentInfo.paymentMethodInfo.method, // TODO: check whether Bold will do mapping from payment type names to the numbers JESTA wants
})

// The actual CSV string creation happens below
//
// The resulting CSV will contain data associated with four different headers,
// so we format the data associated with each header separately, and then combine the
// individual strings with `generateCsvStringFromOrder`.

const generateHeadersCsvStringFromOrder = (/** @type {import('./orders').Order} */ order) => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    fields: HEADER_ROWS
  }

  const headerObject = getHeaderObjectFromOrder(order)
  return parse(headerObject, options)
}

const generateDetailsCsvStringFromOrder = (/** @type {import('./orders').Order} */ order) => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    fields: DETAILS_ROWS
  }

  const detailsObjects = order.lineItems.map(getDetailsObjectFromOrderAndLineItem(order))
  return parse(detailsObjects, options)
}

const generateTaxCsvStringFromOrder = (/** @type {import('./orders').Order} */ order) => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    fields: TAXES_ROWS
  }

  const taxesObjects = order.lineItems.map(getTaxesObjectFromOrderAndLineItem(order))
  return parse(taxesObjects, options)
}

const generateTendersCsvStringFromOrder = (/** @type {import('./orders').Order} */ order) => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    fields: TENDER_ROWS
  }

  const tenderObjects = order.paymentInfo.map(getTenderObjectFromOrderAndPaymentInfoItem(order))
  return parse(tenderObjects, options)
}

/**
 * @explain Generates comma separated header names, which are the same for
 *          every order. Not to be confused with `generateHeadersCsvStringFromOrder`,
 *          which generates the string of the *row* that JESTA classifies as
 *          "header" data.
 */
const generateCsvHeaderNamesString = () => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    header: true
  }

  const headerHeaders = parse({}, { ...options, fields: HEADER_ROWS })
  const detailsHeaders = parse({}, { ...options, fields: DETAILS_ROWS })
  const taxesHeaders = parse({}, { ...options, fields: TAXES_ROWS })
  const tendersHeaders = parse({}, { ...options, fields: TENDER_ROWS })
  const miscHeaders = parse({}, { ...options, fields: MISC_ROWS })
  return `${headerHeaders}\r\n${detailsHeaders}\r\n${taxesHeaders}\r\n${tendersHeaders}\r\n${miscHeaders}`
}

/**
 * @param {import('./orders').Order} order 
 * @return {string}
 */
const generateCsvStringFromOrder = order => {
  const headerNames = generateCsvHeaderNamesString()
  const headerData = generateHeadersCsvStringFromOrder(order)
  const details =  generateDetailsCsvStringFromOrder(order)
  const tax = generateTaxCsvStringFromOrder(order)
  const tenders = generateTendersCsvStringFromOrder(order)

  return `${headerNames}\r\n${headerData}\r\n${details}\r\n${tax}\r\n${tenders}\r\n`
}

module.exports = {
  getHeaderObjectFromOrder,
  getDetailsObjectFromOrderAndLineItem,
  getTaxesObjectFromOrderAndLineItem,
  getTenderObjectFromOrderAndPaymentInfoItem,
  generateHeadersCsvStringFromOrder,
  generateDetailsCsvStringFromOrder,
  generateTaxCsvStringFromOrder,
  generateTendersCsvStringFromOrder,
  generateCsvStringFromOrder,
  generateCsvHeaderNamesString
}
