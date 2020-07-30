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

module.exports = {
  convertToDollars,
  formatDate,
  formatCardExpiryDate,
  getCardReferenceNumberFromPayment,
  getLineOneFromAddress,
  getLineTwoFromAddress
}
