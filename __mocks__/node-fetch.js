const fetch = async () => ({ status: 200, json: async () => ({ access_token: 'access_token' }) })

module.exports = {
  default: fetch
}
