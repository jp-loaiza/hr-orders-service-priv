const currency = require('currency.js')
const { format, utcToZonedTime } = require('date-fns-tz')
const {
  CARD_TYPES_TO_JESTA_CODES,
  CARRIER_IDS,
  CARRIER_IDS_TO_NAMES,
  JESTA_TAX_DESCRIPTIONS,
  SHIPPING_SERVICE_TYPES,
  SHIPPING_SERVICE_TYPES_TO_NAMES,
  PAYMENT_STATES
} = require('./constants')

/**
 * Determines payment released status based on payment methods and current payment state 
 * @param {Object} paymentInfo
 */
const getPaymentReleasedStatus = (paymentInfo) => {
  const creditPaymentInfo = paymentInfo.payments.find(payment => payment.obj.paymentMethodInfo.method.toLowerCase() === 'credit')
  if (!creditPaymentInfo) return 'Y' 

  const paymentKey = creditPaymentInfo.obj.paymentStatus.state.obj.key
  return paymentKey === PAYMENT_STATES.PENDING ? 'Y' : 'N'
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

const paymentIsByCreditCard =  (/** @type {import('./orders').Payment} */ payment) => (
  payment.obj.paymentMethodInfo.method
  && payment.obj.paymentMethodInfo.method.toLowerCase() === 'credit'
)

const getCardReferenceNumberFromPayment =  (/** @type {import('./orders').Payment} */ payment)  => {
  if (!paymentIsByCreditCard(payment)) return undefined
  const firstDigit = payment.obj.custom.fields.bin[0]
  const lastDigit = payment.obj.custom.fields.transaction_card_last4[3]
  return `${firstDigit}${lastDigit}`
}

const getLastFourDigitsOfCardFromPayment = (/** @type {import('./orders').Payment} */ payment) => (
  paymentIsByCreditCard(payment)
    ? payment.obj.custom.fields.transaction_card_last4
    : undefined
)

const getAuthorizationNumberFromPayment = (/** @type {import('./orders').Payment} */ payment) => (
  paymentIsByCreditCard(payment)
    ? payment.obj.custom.fields.auth_number
    : undefined
)

/**
 * Bold stores the date as `MM-YYYY`, but JESTA expects it to be given in `MMYY` format
 * @param {import('./orders').Payment} payment
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
const getLineOneFromAddress = (/** @type {import('./orders').Address} */ address) => address.streetName
const getLineTwoFromAddress = (/** @type {import('./orders').Address} */ address) => address.additionalAddressInfo

const getLineTotalTaxFromLineItem = (/** @type {import('./orders').LineItem} */ lineItem) => {
  const taxes = JSON.parse(lineItem.custom.fields.itemTaxes)
  const taxAmounts = Object.values(taxes).map(Number) 
  return sumMoney(taxAmounts)
}

const getShippingTaxAmountsFromShippingTaxes = (/** @type {string} */ rawShippingTaxes) => {
  const shippingTaxes = JSON.parse(rawShippingTaxes)
  return Object.values(shippingTaxes).map(Number) // dollars
}

const getShippingTaxDescriptionsFromShippingTaxes = (/** @type {string} */ rawShippingTaxes, /** @type {import('./orders').StateCode} */ stateCode) => {
  const shippingTaxes = JSON.parse(rawShippingTaxes)
  // @ts-ignore casting to exact type
  /** @type {Array<import('./orders').BoldTaxDescription>} */ const boldShippingTaxDescriptions = Object.keys(shippingTaxes)
  return boldShippingTaxDescriptions.map(boldTaxDescription => formatJestaTaxDescriptionFromBoldTaxDescription(boldTaxDescription, stateCode))
}

const getTaxTotalFromTaxedPrice = (/** @type {import('./orders').TaxedPrice} */ taxedPrice) => taxedPrice.totalGross.centAmount - taxedPrice.totalNet.centAmount

/**
 * @returns {Array<import('./orders').ParsedTax>}
 */
const getParsedTaxesFromLineItem = (/** @type {import('./orders').LineItem} */ lineItem, /** @type {import('./orders').StateCode} */ stateCode) => {
  const taxes = JSON.parse(lineItem.custom.fields.itemTaxes)
  return Object.entries(taxes).map(([boldTaxDescription, unroundedDollarAmount]) => ({
    // @ts-ignore casting to exact type
    description: formatJestaTaxDescriptionFromBoldTaxDescription(/** @type {import('./orders').BoldTaxDescription} */ boldTaxDescription, stateCode),
    dollarAmount: currency(unroundedDollarAmount, { precision: 4 }).value
  }))
}

/**
 * @param {import('./orders').BoldTaxDescription} boldTaxDescription 
 * @param {import('./orders').StateCode} stateCode
 */
const formatJestaTaxDescriptionFromBoldTaxDescription = (boldTaxDescription, stateCode) => {
  if (boldTaxDescription === 'GST') return JESTA_TAX_DESCRIPTIONS.GST
  // @ts-ignore casting to exact type
  /** @type {import('./orders').TaxDescriptionKey} */ const key = `${boldTaxDescription}_${stateCode}`
  return JESTA_TAX_DESCRIPTIONS[key]
}

/**
 * @param {import('./orders').Payment} payment 
 */
const getPosEquivalenceFromPayment = payment => CARD_TYPES_TO_JESTA_CODES[payment.obj.custom.fields.transaction_card_type]

const formatBarcodeInfo = (/** @type {import('./orders').Barcode} */ barcode) => ({
  number: barcode.obj.value.barcode,
  type: barcode.obj.value.subType
})

/**
 * If more than one barcode exists on the line item, returns the information
 * from the non-UPCE barcode.
 * @param {import('./orders').LineItem} lineItem 
 * @returns {{number: string, type: string}}
 */
const getBarcodeInfoFromLineItem = lineItem => {
  // @ts-ignore casting to known type
  /** @type {{name: any, value: Array<import('./orders').Barcode>} | undefined} **/ const barcodes = lineItem.variant.attributes.find(({ name }) => name === 'barcodes')
  if (!barcodes || barcodes.value.length === 0) throw new Error(`SKU ${lineItem.variant.sku} has no barcodes`)

  const nonUpceBarcode = barcodes.value.find(barcode => barcode.obj.value.subType !== 'UPCE')
  if (nonUpceBarcode) return formatBarcodeInfo(nonUpceBarcode)
  return formatBarcodeInfo(barcodes.value[0])
}

/**
 * @param {{payments: Array<import('./orders').Payment>}} paymentInfo 
 * @returns Sum of the payments in cents
 */
const getPaymentTotalFromPaymentInfo = paymentInfo => (
  paymentInfo.payments.reduce((total, payment) => total + payment.obj.amountPlanned.centAmount, 0)
)

const getCarrierIdFromShippingName = (/** @type {string} **/ name) => {
  if (!name) throw new Error('Shipping name is undefined')

  for (const [carrierId, carrierName] of Object.entries(CARRIER_IDS_TO_NAMES)) {
    if (name.includes(carrierName)) {
      return carrierId
    }
  }
  return null
}

const getShippingServiceTypeFromShippingName = (/** @type {string} **/ name) => {
  if (!name) throw new Error('Shipping name is undefined')

  for (const [shippingServiceType, shippingServiceName] of Object.entries(SHIPPING_SERVICE_TYPES_TO_NAMES)) {
    if (name.includes(shippingServiceName)) {
      return shippingServiceType
    }
  }
  return null
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

module.exports = {
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
  getShippingTaxAmountsFromShippingTaxes,
  getShippingTaxDescriptionsFromShippingTaxes,
  getTaxTotalFromTaxedPrice,
  sumMoney,
  getPaymentReleasedStatus
}
