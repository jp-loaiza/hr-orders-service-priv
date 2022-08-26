const axios = require('axios')


const getLoginRadiusIdforEmail = async (email) => {
  var data = JSON.stringify({
    'from': '2002-07-01',
    'to': '2092-11-22',
    'q': {
      'group': {
        'operator': 'AND',
        'rules': [
          {
            'name': 'Email.Value',
            'operator': '=',
            'value': email
          }
        ]
      }
    },
    'size': 1000
  })

  var config = {
    method: 'post',
    url: 'https://cloud-api.loginradius.com/identity?apikey=' + process.env.LR_APIKEY + '&apisecret=' + process.env.LR_APISECRET,
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  }
  let lrid = ''
  await axios(config)
    .then(function (response) {

      lrid = response.data.data[0].Uid
    })
    .catch(function (error) {
      console.log(error)
    })
  return lrid
}

const getIdentityforLRUUID = async (LRUUID) => {

  var config = {
    method: 'GET',
    url: 'https://api.loginradius.com/identity/v2/manage/account/' + LRUUID + '?apikey=' + process.env.LR_APIKEY + '&apisecret=' + process.env.LR_APISECRET,
    headers: {
      'Content-Type': 'application/json'
    },

  }
  let res
  await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data))
      res = response
    })
    .catch(function (error) {
      console.log(error)
    })

  const email = res.data.Email

  let primaryEmail = email[0].Value
  if (email.length > 0) {
    email.forEach(e => {
      if (e.Type === 'Primary') {
        primaryEmail = e.Value
      }
    })
    return primaryEmail
  }
}

module.exports = { getLoginRadiusIdforEmail, getIdentityforLRUUID }