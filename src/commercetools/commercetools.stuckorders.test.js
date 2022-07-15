
const { getLoginRadiusIdforOrderEmail, getMainAccountId } = require('commercetools')

describe('lrId using email ', () => {
  it('get the email id ', async () => {
    const loginRadiusId = await getLoginRadiusIdforOrderEmail('Testrosen@gmail.com')
    expect(loginRadiusId).toBe('124578qwer')
  }),
  it('get primary email using LrID', async () => {
    const email = await getMainAccountId('124578qwer')
    expect(email).toBe('Testrosen@gmail.com')
  })
})

