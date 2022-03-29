
const SUCCESS_CODES = [1, 104, 202]
const WARNING_CODES = [101, 102, 103, 201]
const FAILURE_CODES = [2, 99]

/**
 * @type {{WARNING: 'warning', SUCCESS: 'success', FAILURE: 'failure'}}
 */
const JESTA_RESPONSE_STATES = {
  WARNING: 'warning',
  SUCCESS: 'success',
  FAILURE: 'failure'
}

module.exports = {
  SUCCESS_CODES,
  WARNING_CODES,
  FAILURE_CODES,
  JESTA_RESPONSE_STATES
}
