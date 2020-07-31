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

const getShippingTaxDescriptionsFromShippingTaxes = (/** @type {string} */ rawShippingTaxes) => {
  const shippingTaxes = JSON.parse(rawShippingTaxes)
  const boldShippingTaxDescriptions = Object.keys(shippingTaxes)
  return boldShippingTaxDescriptions // TODO: Map to JESTA tax descriptions
}

const getTaxTotalFromTaxedPrice = (/** @type {import('./orders').TaxedPrice} */ taxedPrice) => sum(taxedPrice.taxPortions.map(portion => portion.amount.centAmount))

/**
 * @returns {Array<import('./orders').ParsedTax>}
 */
const getParsedTaxesFromLineItem = (/** @type {import('./orders').LineItem} */ lineItem) => {
  const taxes = JSON.parse(lineItem.custom.fields.itemTaxes)
  return Object.entries(taxes).map(([ boldTaxDescription, centAmount]) => ({
    description: boldTaxDescription, // TODO: Map to JESTA tax description
    dollarAmount: convertToDollars(centAmount)
  }))
}

module.exports = {
  convertToDollars,
  flatten,
  formatDate,
  formatCardExpiryDate,
  getCardReferenceNumberFromPayment,
  getLineOneFromAddress,
  getLineTotalTaxFromLineItem,
  getLineTwoFromAddress,
  getParsedTaxesFromLineItem,
  getShippingTaxAmountsFromShippingTaxes,
  getShippingTaxDescriptionsFromShippingTaxes,
  getTaxTotalFromTaxedPrice
}
