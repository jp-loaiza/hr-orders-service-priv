const { JESTA_RESPONSE_STATES, FAILURE_CODES, WARNING_CODES, SUCCESS_CODES } = require('./jesta.constants')

/**
 * @param {import('./orders').JestaApiResponseBody} response
 * @returns {'failure'|'success'|'warning'}
 */
const getJestaApiResponseState = response => {
  if (!response || typeof response !== 'object' || !response.ReturnCode) return JESTA_RESPONSE_STATES.FAILURE
  if (FAILURE_CODES.includes(response.ReturnCode)) return JESTA_RESPONSE_STATES.FAILURE
  if (WARNING_CODES.includes(response.ReturnCode)) return JESTA_RESPONSE_STATES.WARNING
  if (SUCCESS_CODES.includes(response.ReturnCode)) return JESTA_RESPONSE_STATES.SUCCESS
  return JESTA_RESPONSE_STATES.FAILURE
}

module.exports = {
  getJestaApiResponseState
}
