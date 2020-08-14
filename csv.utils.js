const { format, utcToZonedTime } = require('date-fns-tz')
const {
  CARD_TYPES_TO_JESTA_CODES,
  JESTA_TAX_DESCRIPTIONS
} = require('./constants')

const sum  = (/** @type {Array<number>} */ nums) => nums.reduce((total, num) => total + num, 0)

/**
 * Assumes that there are no fractional cent values. (For example, it can be
 * given [1.23], but not [1.234].) Bold will not give us amounts that have
 * fractional cent values.
 */
const sumDollars = (/** @type {Array<number>} */ dollarAmounts) => {
  const centAmounts = dollarAmounts.map(dollarAmount => dollarAmount * 100)
  return convertToDollars(sum(centAmounts))
}

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
  return sumDollars(taxAmounts)
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
  return Object.entries(taxes).map(([boldTaxDescription, dollarAmount]) => ({
    // @ts-ignore casting to exact type
    description: formatJestaTaxDescriptionFromBoldTaxDescription(/** @type {import('./orders').BoldTaxDescription} */ boldTaxDescription, stateCode),
    dollarAmount: Number(dollarAmount)
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
const getPosEquivelenceFromPayment = payment => CARD_TYPES_TO_JESTA_CODES[payment.obj.custom.fields.transaction_card_type]

const getBarcodeInfoFromLineItem = (/** @type {import('./orders').LineItem} */ lineItem) => {
  const barcodes = lineItem.variant.attributes.find(({ name }) => name === 'barcodes')
  if (!barcodes || !barcodes.value[0]) throw new Error(`SKU ${lineItem.variant.sku} has no barcodes`)

  // @ts-ignore casting to Barcode type
  /** @type {import('./orders').Barcode} **/ const barcode = barcodes.value[0] // each SKU has only one barcode
  return {
    number: barcode.obj.value.barcode,
    type: barcode.obj.value.subType
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
  getParsedTaxesFromLineItem,
  getPosEquivelenceFromPayment,
  getShippingTaxAmountsFromShippingTaxes,
  getShippingTaxDescriptionsFromShippingTaxes,
  getTaxTotalFromTaxedPrice,
  sumDollars
}
