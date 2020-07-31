const {
  CARD_TYPES_TO_JESTA_CODES,
  JESTA_TAX_DESCRIPTIONS,
  PAYMENT_METHODS_TO_JESTA_CODES
} = require('./constants')

const sum  = (/** @type {Array<number>} */ nums) => nums.reduce((total, num) => total + num)

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
 * @param {string} jsonDateString 
 */
const formatDate = jsonDateString => (
  jsonDateString.slice(0, 10) + ' ' + jsonDateString.slice(11, 16)
)

const getCardReferenceNumberFromPayment =  (/** @type {import('./orders').Payment} */ payment)  => {
  const firstDigit = payment.obj.custom.fields.bin[0]
  const lastDigit = payment.obj.custom.fields.transaction_card_last4[3]
  return `${firstDigit}${lastDigit}`
}

/**
 * Bold stores the date as `MM-YYYY`, but JESTA expects it to be given in `MMYY` format
 * @param {string} unformattedExpiryDate 
 */
const formatCardExpiryDate = unformattedExpiryDate => unformattedExpiryDate.slice(0, 2) + unformattedExpiryDate.slice(5)

const getLineOneFromAddress = (/** @type {import('./orders').Address} */ address) => `${address.streetNumber} ${address.streetName}`

const getLineTwoFromAddress = (/** @type {import('./orders').Address} */ address) => address.apartment

const getLineTotalTaxFromLineItem = (/** @type {import('./orders').LineItem} */ lineItem) => {
  const taxes = JSON.parse(lineItem.custom.fields.itemTaxes)
  const taxAmounts = Object.values(taxes).map(Number) 
  return sum(taxAmounts)
}

const getShippingTaxAmountsFromShippingTaxes = (/** @type {string} */ rawShippingTaxes) => {
  const shippingTaxes = JSON.parse(rawShippingTaxes)
  return Object.values(shippingTaxes).map(Number)
}

const getShippingTaxDescriptionsFromShippingTaxes = (/** @type {string} */ rawShippingTaxes, /** @type {import('./orders').StateCode} */ stateCode) => {
  const shippingTaxes = JSON.parse(rawShippingTaxes)
  const boldShippingTaxDescriptions = Object.keys(shippingTaxes)
  // @ts-ignore
  return boldShippingTaxDescriptions.map(boldTaxDescription => formatJestaTaxDescriptionFromBoldTaxDescription(boldTaxDescription, stateCode))
}

const getTaxTotalFromTaxedPrice = (/** @type {import('./orders').TaxedPrice} */ taxedPrice) => sum(taxedPrice.taxPortions.map(portion => portion.amount.centAmount))

/**
 * @returns {Array<import('./orders').ParsedTax>}
 */
const getParsedTaxesFromLineItem = (/** @type {import('./orders').LineItem} */ lineItem, /** @type {import('./orders').StateCode} */ stateCode) => {
  const taxes = JSON.parse(lineItem.custom.fields.itemTaxes)
  return Object.entries(taxes).map(([ boldTaxDescription, centAmount]) => ({
    // @ts-ignore
    description: formatJestaTaxDescriptionFromBoldTaxDescription(boldTaxDescription, stateCode),
    dollarAmount: convertToDollars(centAmount)
  }))
}

/**
 * @param {import('./orders').BoldTaxDescription} boldTaxDescription 
 * @param {import('./orders').StateCode} stateCode
 */
const formatJestaTaxDescriptionFromBoldTaxDescription = (boldTaxDescription, stateCode) => {
  if (boldTaxDescription === 'GST') return JESTA_TAX_DESCRIPTIONS.GST
  // @ts-ignore casting to TaxDescriptionKey
  /** @type {import('./orders').TaxDescriptionKey} */ const key = `${boldTaxDescription}_${stateCode}`
  return JESTA_TAX_DESCRIPTIONS[key]
}

/**
 * @param {import('./orders').Payment} payment 
 */
const getPosEquivelenceFromPayment = payment => {
  const isCreditCardPayment = Boolean(payment.obj.custom.fields.transaction_card_type)
  if (isCreditCardPayment) {
    return CARD_TYPES_TO_JESTA_CODES[payment.obj.custom.fields.transaction_card_type]
  }
  // @ts-ignore TODO: complete PAYMENT_METHODS_TO_JESTA_CODES
  return PAYMENT_METHODS_TO_JESTA_CODES[payment.obj.paymentMethodInfo.method]
}

module.exports = {
  convertToDollars,
  flatten,
  formatDate,
  formatCardExpiryDate,
  formatJestaTaxDescriptionFromBoldTaxDescription,
  getCardReferenceNumberFromPayment,
  getLineOneFromAddress,
  getLineTotalTaxFromLineItem,
  getLineTwoFromAddress,
  getParsedTaxesFromLineItem,
  getPosEquivelenceFromPayment,
  getShippingTaxAmountsFromShippingTaxes,
  getShippingTaxDescriptionsFromShippingTaxes,
  getTaxTotalFromTaxedPrice
}
