/**
 * @param {number} cents 
 * @explain CT stores prices in cents, but JESTA expects them to be given in
 *          dollars.
 */
const convertToDollars = cents => cents / 100

/**
 * @param {string} jsonDateString 
 * @explain CT dates are JSON dates, but JESTA expects dates to be of the form `yyyy-MM-dd HH24:MI`
 */
const formatDate = jsonDateString => (
  jsonDateString.slice(0, 10) + ' ' + jsonDateString.slice(11, 16)
)

module.exports = {
  convertToDollars,
  formatDate
}
