const { parse } = require('json2csv')

const {
  DETAILS_ROWS,
  DETAILS_ROWS_ENUM,
  GENERAL_CSV_OPTIONS,
  HEADER_ROWS,
  HEADER_ROWS_ENUM,
  LOCALES_TO_JESTA_LANGUAGE_NUMBERS,
  MISC_ROWS,
  TAXES_ROWS,
  TAXES_ROWS_ENUM,
  TENDER_ROWS,
  TENDER_ROWS_ENUM
} = require('../constants')
const {
  convertAndFormatDate,
  convertToDollars,
  flatten,
  getAuthorizationNumberFromPayment,
  getBarcodeInfoFromLineItem,
  getCardReferenceNumberFromPayment,
  getLastFourDigitsOfCardFromPayment,
  getLineOneFromAddress,
  getLineTotalTaxFromLineItem,
  getLineTwoFromAddress,
  getPaymentTotalFromPaymentInfo,
  getParsedTaxesFromLineItem,
  getPosEquivalenceFromPayment,
  getSignatureRequiredIndicator,
  formatCardExpiryDateFromPayment,
  getShippingInfoForOrder,
  getShippingTaxAmountsFromShippingTaxes,
  getShippingTaxDescriptionsFromShippingTaxes,
  getPaymentReleasedStatus,
  getTaxTotalFromTaxedPrice,
  getFirstLastName,
  lineItemIsEndlessAisle,
  getDomainFromEmail
} = require('./csv.utils')

// The following group of functions turn the CT order object into objects that
// we can feed into the CSV generator to create the CSV

/**
 * @param {import('../orders').Order} order
 */
const getHeaderObjectFromOrder = ({
  cart,
  billingAddress,
  createdAt,
  custom,
  customerEmail,
  locale,
  orderNumber,
  paymentInfo,
  shippingAddress,
  shippingInfo,
  taxedPrice
}) => {
  const { firstName: firstNameShipping, lastName: lastNameShipping } = getFirstLastName(shippingAddress, billingAddress, custom.fields.isStorePickup)
  const { firstName: firstNameBilling, lastName: lastNameBilling } = getFirstLastName(billingAddress, shippingAddress, false)

  return {
    [HEADER_ROWS_ENUM.RECORD_TYPE]: 'H',
    [HEADER_ROWS_ENUM.SITE_ID]: custom.fields.cartSourceWebsite || '00990',
    [HEADER_ROWS_ENUM.WFE_TRANS_ID]: orderNumber,
    [HEADER_ROWS_ENUM.SHIP_TO_FIRST_NAME]: firstNameShipping,
    [HEADER_ROWS_ENUM.SHIP_TO_LAST_NAME]: lastNameShipping,
    [HEADER_ROWS_ENUM.SHIP_TO_ADDRESS_1]: getLineOneFromAddress(shippingAddress),
    [HEADER_ROWS_ENUM.SHIP_TO_ADDRESS_2]: getLineTwoFromAddress(shippingAddress),
    [HEADER_ROWS_ENUM.SHIP_TO_CITY]: shippingAddress.city,
    [HEADER_ROWS_ENUM.SHIP_TO_STATE_ID]: shippingAddress.state,
    [HEADER_ROWS_ENUM.SHIP_TO_ZIP_CODE]: shippingAddress.postalCode,
    [HEADER_ROWS_ENUM.SHIP_TO_COUNTRY_ID]: shippingAddress.country,
    [HEADER_ROWS_ENUM.BILL_TO_FIRST_NAME]: firstNameBilling,
    [HEADER_ROWS_ENUM.BILL_TO_LAST_NAME]: lastNameBilling,
    [HEADER_ROWS_ENUM.BILL_TO_ADDRESS_1]: getLineOneFromAddress(billingAddress),
    [HEADER_ROWS_ENUM.BILL_TO_ADDRESS_2]: getLineTwoFromAddress(billingAddress),
    [HEADER_ROWS_ENUM.BILL_TO_CITY]: billingAddress.city,
    [HEADER_ROWS_ENUM.BILL_TO_STATE_ID]: billingAddress.state,
    [HEADER_ROWS_ENUM.BILL_TO_ZIP_CODE]: billingAddress.postalCode,
    [HEADER_ROWS_ENUM.BILL_TO_COUNTRY_ID]: billingAddress.country,
    [HEADER_ROWS_ENUM.BILL_TO_HOME_PHONE]: billingAddress.phone || shippingAddress.phone, // From JESTA's docs: "Both [BILL_TO_HOME_PHONE and SHIP_TO_HOME_PHONE] are copied from this field"
    [HEADER_ROWS_ENUM.EMAIL_ADDRESS]: customerEmail,
    [HEADER_ROWS_ENUM.CARRIER_ID]: getShippingInfoForOrder(custom.fields.cartSourceWebsite, shippingInfo.shippingMethodName).carrierId,
    [HEADER_ROWS_ENUM.RUSH_SHIPPING_IND]: getShippingInfoForOrder(custom.fields.cartSourceWebsite, shippingInfo.shippingMethodName).shippingIsRush ? 'Y' : 'N',
    [HEADER_ROWS_ENUM.SHIP_COMPLETE_IND]: 'N',
    [HEADER_ROWS_ENUM.SHIPPING_CHARGES_TOTAL]: convertToDollars(shippingInfo.taxedPrice.totalNet.centAmount),
    [HEADER_ROWS_ENUM.TAX_TOTAL]: convertToDollars(getTaxTotalFromTaxedPrice(taxedPrice)),
    [HEADER_ROWS_ENUM.TRANSACTION_TOTAL]: paymentInfo !== undefined ? convertToDollars(getPaymentTotalFromPaymentInfo(paymentInfo)) : 0,
    [HEADER_ROWS_ENUM.ORDER_DATE]: convertAndFormatDate(createdAt),
    [HEADER_ROWS_ENUM.ADDITIONAL_METADATA]: custom.fields.loginRadiusUid,
    [HEADER_ROWS_ENUM.SHIPPING_TAX1]: getShippingTaxAmountsFromShippingTaxes(custom.fields.shippingTaxes)[0],
    [HEADER_ROWS_ENUM.SHIPPING_TAX1_DESCRIPTION]: getShippingTaxDescriptionsFromShippingTaxes(custom.fields.shippingTaxes, shippingAddress.state)[0],
    [HEADER_ROWS_ENUM.SHIPPING_TAX2]: getShippingTaxAmountsFromShippingTaxes(custom.fields.shippingTaxes)[1] && getShippingTaxAmountsFromShippingTaxes(custom.fields.shippingTaxes)[1],
    [HEADER_ROWS_ENUM.SHIPPING_TAX2_DESCRIPTION]: getShippingTaxDescriptionsFromShippingTaxes(custom.fields.shippingTaxes, shippingAddress.state)[1],
    [HEADER_ROWS_ENUM.REQUESTER_SITE_ID]: custom.fields.cartSourceWebsite || '00990',
    [HEADER_ROWS_ENUM.DESTINATION_SITE_ID]: parseInt(custom.fields.destinationSiteId) ? custom.fields.destinationSiteId : null,
    [HEADER_ROWS_ENUM.SERVICE_TYPE]: getShippingInfoForOrder(custom.fields.cartSourceWebsite, shippingInfo.shippingMethodName).shippingServiceType,
    [HEADER_ROWS_ENUM.LANGUAGE_NO]: LOCALES_TO_JESTA_LANGUAGE_NUMBERS[locale],
    [HEADER_ROWS_ENUM.FREE_RETURN_IND]: 'N',
    [HEADER_ROWS_ENUM.SIGNATURE_REQUIRED_IND]: paymentInfo !== undefined ? getSignatureRequiredIndicator(paymentInfo,custom.fields.isStorePickup) : 'N',
    [HEADER_ROWS_ENUM.RELEASED]: paymentInfo !== undefined ? getPaymentReleasedStatus(paymentInfo) : 'Y',
    [HEADER_ROWS_ENUM.GIFT_NOTE]: custom.fields.giftMessage,
    [HEADER_ROWS_ENUM.LOYALTY_SESSION_ID]: cart.id
  }
}

const getDetailsObjectFromOrderAndLineItem = (/** @type {import('../orders').Order} */ order) => (/** @type {import('../orders').LineItem} */ lineItem, /** @type {number} */ index) => ({
  [DETAILS_ROWS_ENUM.RECORD_TYPE]: 'D',
  [DETAILS_ROWS_ENUM.SITE_ID]: order.custom.fields.cartSourceWebsite || '00990',
  [DETAILS_ROWS_ENUM.LINE]: index + 1,
  [DETAILS_ROWS_ENUM.WFE_TRANS_ID]: order.orderNumber,
  [DETAILS_ROWS_ENUM.QTY_ORDERED]: lineItem.quantity,
  [DETAILS_ROWS_ENUM.UNIT_PRICE]: convertToDollars(lineItem.discountedPrice ? lineItem.discountedPrice.value.centAmount : lineItem.price.value.centAmount),
  [DETAILS_ROWS_ENUM.EXTENSION_AMOUNT]: convertToDollars(lineItem.totalPrice.centAmount),
  [DETAILS_ROWS_ENUM.LINE_SHIPPING_CHARGES]: lineItem.custom.fields.lineShippingCharges ? convertToDollars(lineItem.custom.fields.lineShippingCharges.centAmount) : 0,
  [DETAILS_ROWS_ENUM.LINE_TOTAL_TAX]: getLineTotalTaxFromLineItem(lineItem),
  [DETAILS_ROWS_ENUM.LINE_TOTAL_AMOUNT]: convertToDollars(lineItem.taxedPrice.totalGross.centAmount),
  [DETAILS_ROWS_ENUM.BAR_CODE_ID]: getBarcodeInfoFromLineItem(lineItem).number,
  [DETAILS_ROWS_ENUM.ENDLESS_AISLE_IND]: lineItemIsEndlessAisle(lineItem) ? 'Y' : 'N',
  [DETAILS_ROWS_ENUM.EXT_REF_ID]: lineItem.id,
  [DETAILS_ROWS_ENUM.GIFT_WRAP_IND]: lineItem.custom.fields.isGift ? 'Y' : 'N',
  [DETAILS_ROWS_ENUM.SALESPERSON_ID]: getDomainFromEmail(order) === 'harryrosen.com'
    ? 999
    : lineItem.custom.fields.salespersonId,
  [DETAILS_ROWS_ENUM.SUB_TYPE]: getBarcodeInfoFromLineItem(lineItem).type,
  [DETAILS_ROWS_ENUM.ITEM_IDENTIFIER]: lineItem.id
})

/**
 * @param {{ siteId: string, lineNumber: number, orderNumber: string, sequenceNumber: number, tax: import('../orders').ParsedTax }} lineItemTaxInfo
 */
const getSingleTaxesObject = ({ siteId, lineNumber, orderNumber, sequenceNumber, tax }) => ({
  [TAXES_ROWS_ENUM.RECORD_TYPE]: 'T',
  [TAXES_ROWS_ENUM.SITE_ID]: siteId,
  [TAXES_ROWS_ENUM.LINE]: lineNumber,
  [TAXES_ROWS_ENUM.WFE_TRANS_ID]: orderNumber,
  [TAXES_ROWS_ENUM.SEQUENCE]: sequenceNumber,
  [TAXES_ROWS_ENUM.MERCHANDISE_TAX_AMOUNT]: tax.dollarAmount,
  [TAXES_ROWS_ENUM.MERCHANDISE_TAX_DESC]: tax.description
})

const getallTaxesObjectsFromOrderAndLineItem = (/** @type {import('../orders').Order} */ order) => (/** @type {import('../orders').LineItem} */ lineItem, /** @type {number} */ lineIndex) => {
  const taxes = getParsedTaxesFromLineItem(lineItem, order.shippingAddress.state)
  return taxes.map((tax, taxIndex) => getSingleTaxesObject({
    siteId: order.custom.fields.cartSourceWebsite || '00990',
    lineNumber: lineIndex + 1,
    orderNumber: order.orderNumber,
    sequenceNumber: taxIndex + 1,
    tax
  }))
}

const getTenderObjectFromOrderAndPaymentInfoItem = (/** @type {import('../orders').Order} */ order) => (/** @type {import('../orders').Payment} */ payment, /** @type {number} */ index) => ({
  [TENDER_ROWS_ENUM.RECORD_TYPE]: 'N',
  [TENDER_ROWS_ENUM.SITE_ID]: order.custom.fields.cartSourceWebsite || '00990',
  [TENDER_ROWS_ENUM.LINE]: index + 1, // From JESTA's docs: "Always 1 if 1 tender method. Increment if multiple tenders used"
  [TENDER_ROWS_ENUM.WFE_TRANS_ID]: order.orderNumber,
  [TENDER_ROWS_ENUM.AMOUNT]: convertToDollars(payment.obj.amountPlanned.centAmount),
  [TENDER_ROWS_ENUM.POS_EQUIVALENCE]: getPosEquivalenceFromPayment(payment),
  [TENDER_ROWS_ENUM.REFERENCENO]: getCardReferenceNumberFromPayment(payment),
  [TENDER_ROWS_ENUM.EXPDATE]: formatCardExpiryDateFromPayment(payment),
  [TENDER_ROWS_ENUM.CARD_NO]: getLastFourDigitsOfCardFromPayment(payment),
  [TENDER_ROWS_ENUM.AUTHORIZATION_NO]: getAuthorizationNumberFromPayment(payment)
})

const getTenderObjectFromOrderWithNoPayment = (/** @type {import('../orders').Order} */ order) =>  ({
  [TENDER_ROWS_ENUM.RECORD_TYPE]: 'N',
  [TENDER_ROWS_ENUM.SITE_ID]: order.custom.fields.cartSourceWebsite || '00990',
  [TENDER_ROWS_ENUM.LINE]: 1, // From JESTA's docs: "Always 1 if 1 tender method. Increment if multiple tenders used"
  [TENDER_ROWS_ENUM.WFE_TRANS_ID]: order.orderNumber,
  [TENDER_ROWS_ENUM.AMOUNT]: 0,
  [TENDER_ROWS_ENUM.POS_EQUIVALENCE]: '37', //Miscellaenous
  [TENDER_ROWS_ENUM.REFERENCENO]: '',
  [TENDER_ROWS_ENUM.EXPDATE]: '',
  [TENDER_ROWS_ENUM.CARD_NO]: '',
  [TENDER_ROWS_ENUM.AUTHORIZATION_NO]: ''
})

// The actual CSV string creation happens below
//
// The resulting CSV will contain data associated with four different headers,
// so we format the data associated with each header separately, and then combine the
// individual strings with `generateCsvStringFromOrder`.

const generateHeadersCsvStringFromOrder = (/** @type {import('../orders').Order} */ order) => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    fields: HEADER_ROWS
  }

  const headerObject = getHeaderObjectFromOrder(order)
  return parse([headerObject], options)
}

const generateDetailsCsvStringFromOrder = (/** @type {import('../orders').Order} */ order) => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    fields: DETAILS_ROWS
  }

  const detailsObjects = order.lineItems.map(getDetailsObjectFromOrderAndLineItem(order))
  return parse(detailsObjects, options)
}

const generateTaxCsvStringFromOrder = (/** @type {import('../orders').Order} */ order) => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    fields: TAXES_ROWS
  }

  const taxesObjects = flatten(order.lineItems.map(getallTaxesObjectsFromOrderAndLineItem(order)))
  return parse(taxesObjects, options)
}

const generateTendersCsvStringFromOrder = (/** @type {import('../orders').Order} */ order) => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    fields: TENDER_ROWS
  }

  let tenderObjects

  if(order.paymentInfo) {
    tenderObjects = order.paymentInfo.payments
      .filter(payment => (!payment.obj.paymentStatus) || payment.obj.paymentStatus.interfaceCode !== 'failed')
      .map(getTenderObjectFromOrderAndPaymentInfoItem(order))
  } else {
    tenderObjects = getTenderObjectFromOrderWithNoPayment(order)
  }

  return parse(tenderObjects, options)
}

/**
 * Generates comma separated header names, which are the same for every order.
 * Not to be confused with `generateHeadersCsvStringFromOrder`, which generates
 * the string of the *row* that JESTA classifies as "header" data.
 */
const generateCsvHeaderNamesString = () => {
  const options = {
    ...GENERAL_CSV_OPTIONS,
    header: true,
    quote: '', // JESTA can't process the CSV if its headers are quoted
    escapedQuote: ''
  }

  const headerHeaders = parse({}, { ...options, fields: HEADER_ROWS })
  const detailsHeaders = parse({}, { ...options, fields: DETAILS_ROWS })
  const taxesHeaders = parse({}, { ...options, fields: TAXES_ROWS })
  const tendersHeaders = parse({}, { ...options, fields: TENDER_ROWS })
  const miscHeaders = parse({}, { ...options, fields: MISC_ROWS })
  return `${headerHeaders}\r\n${detailsHeaders}\r\n${taxesHeaders}\r\n${tendersHeaders}\r\n${miscHeaders}`
}

/**
 * @param {import('../events/OrderProcessMessage').IOrder} order
 * @return {string}
 */
const generateCsvStringFromOrder = order => {
  //Remove \n that are sometimes added in JSON coming from CT
  order = JSON.parse(JSON.stringify(order).replace(/(\r\n|\\n|\r|\t)/gm, ''))

  const headerNames = generateCsvHeaderNamesString()
  const headerData = generateHeadersCsvStringFromOrder(order)
  const details = generateDetailsCsvStringFromOrder(order)
  const tax = generateTaxCsvStringFromOrder(order)
  const tenders = generateTendersCsvStringFromOrder(order)

  if (!tenders) {
    return `${headerNames}\r\n${headerData}\r\n${details}\r\n${tax}\r\n`
  }

  return `${headerNames}\r\n${headerData}\r\n${details}\r\n${tax}\r\n${tenders}\r\n`
}

module.exports = {
  generateCsvStringFromOrder
}
