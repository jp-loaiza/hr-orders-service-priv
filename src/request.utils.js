const fetch = require('node-fetch').default
const AbortController = require('abort-controller')
const { FETCH_ABORT_TIMEOUT } = require('./constants')

/**
 * @param {{url: string, request: import('node-fetch').Request, response: import('node-fetch').Response, responseBody: object|string}} params
 */
const formatRequestAndResponseLogString = ({ url, request, response, responseBody }) => JSON.stringify({
  request: {
    url,
    body: request.body
  },
  response: {
    body: responseBody,
    status: response.status,
    statusText: response.statusText,
    contentType: response.headers.get('content-type')
  }
})

/**
 * 
 * @param {string} url 
 * @param {object} options 
 * @param {boolean} verboseLogging 
 */
const fetchWithTimeout = async (url, options, verboseLogging = false) => {
  // @ts-ignore
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort()
  }, FETCH_ABORT_TIMEOUT)

  const response = await fetch(url, { ...options, signal: controller.signal })
    .catch(error => {
      if (error.name === 'AbortError') {
        console.error('Api request was aborted.')
      }
      throw error
    })
    .finally(() => { clearTimeout(timeout) })
  const contentType = response.headers.get('content-type')
  const content = contentType && contentType.includes('application/json') && response.status !== 204 // .json() fails if no content (204)
    ? await response.json()
    : await response.text()

  if (verboseLogging) {
    // @ts-ignore
    console.debug('node-fetch request and response:', formatRequestAndResponseLogString({ url, request: options, response, responseBody: content }))
  }
  if (response.ok) return content
  const error = new Error(`API responded with status ${response.status}: ${JSON.stringify(content)}.`)
  console.error(error)
  console.error(response)
  throw error
}

module.exports = {
  fetchWithTimeout
}
