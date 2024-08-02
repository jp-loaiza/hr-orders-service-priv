const currency = require('currency.js')
const { format, utcToZonedTime } = require('date-fns-tz')
const {
  CARD_TYPES_TO_JESTA_CODES,
  CITCON_PAYMENT_METHODS,
  CARRIER_IDS,
  CARRIER_IDS_TO_NAMES,
  ENDLESS_AISLE_SHIPPING_NAMES_TO_SHIPPING_SERVICE_TYPES,
  JESTA_TAX_DESCRIPTIONS,
  SHIPPING_SERVICE_TYPES,
  SHIPPING_SERVICE_TYPES_TO_NAMES,
  PAYMENT_STATES,
  TRANSACTION_TYPES,
  TRANSACTION_STATES,
  ENDLESS_AISLE_SHIPPING_NAMES_TO_CARRIER_IDS
} = require('../constants')

/**
 * Determines payment released status based on payment methods and current payment state 
 * @param {import('../orders').PaymentInfo} paymentInfo
 */
const getPaymentReleasedStatus = (paymentInfo) => {

  // We are temporary set the release flag to N if the payments are all using giftcard
  if (paymentInfo.payments.length 
    && paymentInfo.payments.filter(
      payment => payment.obj.paymentMethodInfo.method.toLowerCase() === 'plugin' && payment.obj.custom.fields.transaction_card_type === 'Harry Rosen Giftcard'
    ).length === paymentInfo.payments.length) 
  {
    return 'N'
  }

  const creditPaymentInfo = paymentInfo.payments.find(payment => payment.obj.paymentMethodInfo.method.toLowerCase() === 'credit')
  if (!creditPaymentInfo) return 'Y' 

  const interfaceCode = creditPaymentInfo.obj.paymentStatus.interfaceCode
  let successfulTransaction = null
  if (interfaceCode === PAYMENT_STATES.PREAUTHED) { // delayed capture is ON
    successfulTransaction = creditPaymentInfo.obj.transactions.find(transaction => transaction.type === TRANSACTION_TYPES.AUTHORIZATION && transaction.state === TRANSACTION_STATES.SUCCESS)
  } else if (interfaceCode === PAYMENT_STATES.PAID) { // delayed capture is OFF
    successfulTransaction = creditPaymentInfo.obj.transactions.find(transaction => transaction.type === TRANSACTION_TYPES.CHARGE && transaction.state === TRANSACTION_STATES.SUCCESS)
  }
  return successfulTransaction ? 'Y' : 'N'
}

const sumMoney  = (/** @type {Array<number>} */ nums) => (
  nums.reduce((total, num) => currency(total, { precision: 4 }).add(num), currency(0))
).value

/**
 * @returns {any}
 */
const flatten = ( /** @type {any} */ x) => {
  if (!Array.isArray(x)) return x
  return x.reduce((flattenedArray, item) => (
    [...flattenedArray, ...Array.isArray(item) ? flatten(item) : [item] ]) , []
  )
}

/**
 * CT stores prices in cents, but JESTA expects them to be given in dollars
 * @param {number} cents
 */
const convertToDollars = cents => cents / 100

/**
 * CT dates are JSON dates, but JESTA expects dates to be of the form `yyyy-MM-dd HH24:MI`
 * JESTA also expects dates to be in Eastern time, but CT dates are in UTC.
 * @param {string} jsonDateString 
 */
const convertAndFormatDate = jsonDateString => {
  const utcDate = new Date(jsonDateString)
  const timeZone = 'America/New_York' // Eastern time
  const easternDate = utcToZonedTime(utcDate, timeZone)
  const template = 'yyyy-MM-dd HH:mm'

  return format(easternDate, template, { timeZone })
}


const paymentIsByCreditCard =  (/** @type {import('../orders').Payment} */ payment) => (
  payment.obj.paymentMethodInfo.method
  && payment.obj.paymentMethodInfo.method.toLowerCase() === 'credit'
)

const getCardReferenceNumberFromPayment =  (/** @type {import('../orders').Payment} */ payment)  => {
  if (!paymentIsByCreditCard(payment)) return undefined
  const firstDigit = payment.obj.custom.fields.bin[0]
  const lastDigit = payment.obj.custom.fields.transaction_card_last4[3]
  return `${firstDigit}${lastDigit}`
}

const getLastFourDigitsOfCardFromPayment = (/** @type {import('../orders').Payment} */ payment) => (
  paymentIsByCreditCard(payment)
    ? payment.obj.custom.fields.transaction_card_last4
    : undefined
)

const getAuthorizationNumberFromPayment = (/** @type {import('../orders').Payment} */ payment) => (
  paymentIsByCreditCard(payment)
    ? payment.obj.custom.fields.auth_number
    : undefined
)

/**
 * Bold stores the date as `MM-YYYY`, but JESTA expects it to be given in `MMYY` format
 * @param {import('../orders').Payment} payment
 */
const formatCardExpiryDateFromPayment = payment => {
  if (!paymentIsByCreditCard(payment)) return undefined
  const unformattedExpiryDate = payment.obj.custom.fields.transaction_card_expiry
  return unformattedExpiryDate.slice(0, 2) + unformattedExpiryDate.slice(5)
}

/**
 * commercetools address are more fine-grained than LoginRadius or Bold
 * addresses and lack line one or line two fields. To avoid possible
 * parsing issues, line one is stored in `streetName` and line two is stored
 * in `additionalAddressInfo`.
 */
const getLineOneFromAddress = (/** @type {import('../orders').Address} */ address) => address.streetName
const getLineTwoFromAddress = (/** @type {import('../orders').Address} */ address) => address.additionalAddressInfo

const getLineTotalTaxFromLineItem = (/** @type {import('../orders').LineItem} */ lineItem) => {
  const taxes = JSON.parse(lineItem.custom.fields.itemTaxes)
  const taxAmounts = Object.values(taxes).map(Number) 
  return sumMoney(taxAmounts)
}

const getShippingTaxAmountsFromShippingTaxes = (/** @type {string} */ rawShippingTaxes) => {
  const shippingTaxes = JSON.parse(rawShippingTaxes)
  return Object.values(shippingTaxes).map(Number) // dollars
}

const getShippingTaxDescriptionsFromShippingTaxes = (/** @type {string} */ rawShippingTaxes, /** @type {import('../orders').StateCode} */ stateCode) => {
  const shippingTaxes = JSON.parse(rawShippingTaxes)
  // @ts-ignore casting to exact type
  /** @type {Array<import('../orders').BoldTaxDescription>} */ const boldShippingTaxDescriptions = Object.keys(shippingTaxes)
  return boldShippingTaxDescriptions.map(boldTaxDescription => formatJestaTaxDescriptionFromBoldTaxDescription(boldTaxDescription, stateCode))
}

const getTaxTotalFromTaxedPrice = (/** @type {import('../orders').TaxedPrice} */ taxedPrice) => taxedPrice.totalGross.centAmount - taxedPrice.totalNet.centAmount

/**
 * @returns {Array<import('../orders').ParsedTax>}
 */
const getParsedTaxesFromLineItem = (/** @type {import('../orders').LineItem} */ lineItem, /** @type {import('../orders').StateCode} */ stateCode) => {
  const taxes = JSON.parse(lineItem.custom.fields.itemTaxes)
  return Object.entries(taxes).map(([boldTaxDescription, unroundedDollarAmount]) => ({
    // @ts-ignore casting to exact type
    description: formatJestaTaxDescriptionFromBoldTaxDescription(/** @type {import('../orders').BoldTaxDescription} */ boldTaxDescription, stateCode),
    dollarAmount: currency(unroundedDollarAmount, { precision: 4 }).value
  }))
}

/**
 * @param {import('../orders').BoldTaxDescription} boldTaxDescription 
 * @param {import('../orders').StateCode} stateCode
 */
const formatJestaTaxDescriptionFromBoldTaxDescription = (boldTaxDescription, stateCode) => {
  if (boldTaxDescription === 'GST') return JESTA_TAX_DESCRIPTIONS.GST
  // @ts-ignore casting to exact type
  /** @type {import('../orders').TaxDescriptionKey} */ const key = `${boldTaxDescription}_${stateCode}`
  return JESTA_TAX_DESCRIPTIONS[key]
}

/**
 * @param {import('../orders').Payment} payment 
 * @param {import('../orders').tCARD_TYPES_TO_JESTA_CODES} CARD_TYPES_TO_JESTA_CODES 
 */
const jestaCodeFromCardType = (payment,CARD_TYPES_TO_JESTA_CODES) => {
  if ((payment.obj.custom.fields.transaction_card_type.toLowerCase() === 'citcon payment') && (payment.obj.custom.fields.transaction_card_last4 === 'upop')) {
    return CITCON_PAYMENT_METHODS['upop']
  } else if (payment.obj.custom.fields.transaction_card_type.toLowerCase() === 'citcon payment') {
    return CITCON_PAYMENT_METHODS['others']
  }
  return CARD_TYPES_TO_JESTA_CODES[payment.obj.custom.fields.transaction_card_type.toLowerCase()]
}

/**
 * @param {import('../orders').Payment} payment 
 */
const getPosEquivalenceFromPayment = payment => jestaCodeFromCardType(payment,CARD_TYPES_TO_JESTA_CODES)

const formatBarcodeInfo = (/** @type {import('../orders').Barcode} */ barcode) => ({
  number: barcode.obj.value.barcode,
  type: barcode.obj.value.subType
})

const barcodeIsApplicable = (/** @type {import('../orders').Barcode} **/ barcode) => {
  if (!barcode.obj.value.effectiveAt || !barcode.obj.value.expiresAt) return true
  const now = new Date()
  return new Date(barcode.obj.value.effectiveAt) <= now && new Date(barcode.obj.value.expiresAt) > now
}

/**
 * If more than one barcode exists on the line item, returns the information
 * from the non-UPCE barcode.
 * @param {import('../orders').LineItem} lineItem 
 * @returns {{number: string, type: string}}
 */
const getBarcodeInfoFromLineItem = lineItem => {
  // @ts-ignore casting to known type
  /** @type {{name: any, value: Array<import('../orders').Barcode>} | undefined} **/ const barcodes = lineItem.variant.attributes.find(({ name }) => name === 'barcodes')
  if (!barcodes || barcodes.value.length === 0) throw new Error(`SKU ${lineItem.variant.sku} has no barcodes`)
  const applicableBarcodes = barcodes.value.filter(barcodeIsApplicable)
  if (applicableBarcodes.length === 0) throw new Error(`SKU ${lineItem.variant.sku} has barcodes, but none are valid`)

  const upceBarcode = applicableBarcodes.find(barcode => barcode.obj.value.subType === 'UPCE')
  if (lineItemIsEndlessAisle(lineItem)) {
    if (!upceBarcode) throw new Error(`EA SKU ${lineItem.variant.sku} lacks an effective UPCE barcode`)
    return formatBarcodeInfo(upceBarcode)
  }

  //We need to prioritize UPCE codes HRC-8038
  if(upceBarcode) {
    return formatBarcodeInfo(upceBarcode)
  }

  const nonUpceBarcode = applicableBarcodes.find(barcode => barcode.obj.value.subType !== 'UPCE')
  if (nonUpceBarcode) return formatBarcodeInfo(nonUpceBarcode)
  return formatBarcodeInfo(applicableBarcodes[0])
}

/**
 * @param {{payments: Array<import('../orders').Payment>}} paymentInfo 
 * @returns Sum of the payments in cents
 */
const getPaymentTotalFromPaymentInfo = paymentInfo => (
  paymentInfo.payments.reduce((total, payment) => total + payment.obj.amountPlanned.centAmount, 0)
)

const getCarrierIdFromShippingName = (/** @type {string} **/ name) => {
  if (!name) throw new Error('Shipping name is undefined')

  if (Object.keys(ENDLESS_AISLE_SHIPPING_NAMES_TO_CARRIER_IDS).includes(name.trim())) {
    return ENDLESS_AISLE_SHIPPING_NAMES_TO_CARRIER_IDS[name.trim()]
  }

  for (const [carrierId, carrierName] of Object.entries(CARRIER_IDS_TO_NAMES)) {
    if (name.includes(carrierName)) {
      return carrierId
    }
  }
  return null
}

const getShippingServiceTypeFromShippingName = (/** @type {string|null} **/ name) => {
  if (!name) throw new Error('Shipping name is undefined')

  if (Object.keys(ENDLESS_AISLE_SHIPPING_NAMES_TO_SHIPPING_SERVICE_TYPES).includes(name.trim())) {
    return ENDLESS_AISLE_SHIPPING_NAMES_TO_SHIPPING_SERVICE_TYPES[name.trim()]
  }
  
  for (const [shippingServiceType, shippingServiceName] of Object.entries(SHIPPING_SERVICE_TYPES_TO_NAMES)) {
    if (name.includes(shippingServiceName)) {
      return shippingServiceType
    }
  }
  return null
}


/**
 * Determines payment signature required indicator based on payment 
 * @param {import('../orders').PaymentInfo} paymentInfo
 * @param {boolean} isStorePickup
 */
const getSignatureRequiredIndicator = (paymentInfo, isStorePickup) => {


  // Checking Signature Required Indicator for non-BOPIS orders over 10k (HRC-7180)
  const paymentTotal = getPaymentTotalFromPaymentInfo(paymentInfo)
  if (!isStorePickup && paymentTotal >= 1000000) {
    return 'Y'; // Signature required
  }

  //checking Klarna Signature Required Inidcator (HRC-5233)
  const klarnaPaymentInfo = paymentInfo.payments.find(payment => payment.obj.custom.fields.transaction_card_type.toLowerCase() === 'klarna')
  if(klarnaPaymentInfo && klarnaPaymentInfo.obj.amountPlanned.centAmount >= 94000) {
    return 'Y'
  }

  //checking PayPal Signature Required Inidcator (HRC-6526)
  const payPalPaymentInfo = paymentInfo.payments.find(payment => payment.obj.custom.fields.transaction_card_type.toLowerCase() === 'paypal')
  if(payPalPaymentInfo && payPalPaymentInfo.obj.amountPlanned.centAmount >= 85000) {
    return 'Y'
  }

  return 'N'
}

const getShippingInfoForOrder = (/** @type {string|undefined} **/ cartSourceWebsite, /** @type {string} **/ name) => {
  if (cartSourceWebsite && cartSourceWebsite == '00997') {
    
    if(name.trim() == 'Standard Shipping') {
      return {
        carrierId : 'CP',
        shippingServiceType : 'EXPEDITED PARCEL',
        shippingIsRush : false
      }
    }

    if(name.trim() == 'Express Shipping') {
      return {
        carrierId : 'CP',
        shippingServiceType : 'XPRESSPOST',
        shippingIsRush : true
      }
    }
    
  } 
  return getShippingInfoFromShippingName(name)
}

const getShippingInfoFromShippingName = (/** @type {string} **/ name) => {
  const carrierId = getCarrierIdFromShippingName(name)
  const shippingServiceType = getShippingServiceTypeFromShippingName(name)
  const shippingIsRush = (
    !(carrierId === CARRIER_IDS.CP && shippingServiceType === SHIPPING_SERVICE_TYPES.EXPEDITED_PARCEL)
    && !(carrierId === CARRIER_IDS.FDX && shippingServiceType === SHIPPING_SERVICE_TYPES.ECONOMY)
    && Boolean(carrierId || shippingServiceType)
  )

  return {
    carrierId,
    shippingServiceType,
    shippingIsRush
  }
}

/**
 * @param {import('../orders').Address} address1 
 * @param {import('../orders').Address} address2 
 * @param {boolean} isStorePickup 
 */
const getFirstLastName = (address1, address2, isStorePickup) => {
  if (isStorePickup) {
    const firstName = address1.firstName || address2.firstName
    const lastName = address1.lastName || address2.lastName
    if (!firstName || !lastName) {
      console.error('Missing firstname/lastname on order')
      throw new Error('Missing firstname/lastname on order')
    }
    return {
      firstName,
      lastName
    }
  }

  if (!address1.firstName || !address1.lastName) {
    console.error('Missing firstname/lastname on order')
    throw new Error('Missing firstname/lastname on order')
  }
  return {
    firstName: address1.firstName,
    lastName: address1.lastName
  }
}

const lineItemIsEndlessAisle = (/** @type {import('../orders').LineItem} */ lineItem) => {
  const endlessAisleAttribute = lineItem.variant.attributes.find(attribute => attribute.name === 'isEndlessAisle')
  return endlessAisleAttribute ? endlessAisleAttribute.value : false 
}

const getDomainFromEmail = (/** @type {import('../orders').Order} */ order) => {
  return order.customerEmail ? order.customerEmail.substring(order.customerEmail.indexOf('@') + 1) : ''
}

module.exports = {
  barcodeIsApplicable,
  convertAndFormatDate,
  convertToDollars,
  flatten,
  formatCardExpiryDateFromPayment,
  formatJestaTaxDescriptionFromBoldTaxDescription,
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
  getShippingInfoFromShippingName,
  getShippingInfoForOrder,
  getShippingTaxAmountsFromShippingTaxes,
  getShippingTaxDescriptionsFromShippingTaxes,
  getTaxTotalFromTaxedPrice,
  lineItemIsEndlessAisle,
  sumMoney,
  getPaymentReleasedStatus,
  getSignatureRequiredIndicator,
  getFirstLastName,
  getDomainFromEmail
}
