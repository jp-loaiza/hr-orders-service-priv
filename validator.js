const Ajv = require('ajv')

const ajv = new Ajv({ allErrors: true })

const addressSchema = {
  type: 'object',
  properties: {
    state: {
      type: 'string',
      maxLength: 2,
      minLength: 2
    }
  },
  required: ['firstName', 'lastName', 'additionalStreetInfo', 'postalCode', 'city', 'country', 'phone']
}

// Many values are guaranteed to exist or be of the correct form by CT, so we
// don't need to validate them
const orderSchema = {
  type: 'object',
  properties: {
    shippingAddress: addressSchema,
    bullingAddress: addressSchema
  },
  required: ['customerEmail', 'shippingAddress', 'billingAddress']
}

const validateOrder = ajv.compile(orderSchema)

module.exports = {
  validateOrder
}
