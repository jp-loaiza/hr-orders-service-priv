
const { fetchFullOrder } = require('./commercetools')
const { EMAIL_API_OWNER_ID } = require('./constants')

const formatEmailApiRequestBodyFromOrder = order => ({
  request: {
    OwnerId: EMAIL_API_OWNER_ID,
    Channel: 'Email',
    Subject: JSON.stringify({ Name: 'Salesorder', Id: order.orderNumber }),
    Topic: 'Confirmation',
    Recipient: JSON.stringify({
      address: order.customerEmail,
      locale: order.locale
    }),
    Sender: '',
    Data: JSON.stringify(order)
  }
})

module.exports = {
  formatEmailApiRequestBodyFromOrder
}
