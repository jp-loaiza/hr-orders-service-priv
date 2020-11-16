const fetch = require('node-fetch').default
const AbortController = require('abort-controller')
const { FETCH_ABORT_TIMEOUT } = require('./constants')

const fetchWithTimeout = async (url, options) => {
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
  const content = contentType && contentType.includes('application/json')
    ? await response.json()
    : await response.text()
  if (response.status === 200) return content
  const error = new Error(`API responded with status ${response.status}: ${JSON.stringify(content)}.`)
  console.error(error)
  console.error(response)
  throw error
}

module.exports = {
  fetchWithTimeout
}
