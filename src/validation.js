const Ajv = require('ajv')

const ajv = new Ajv({ allErrors: true })

const addressSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    state: {
      type: 'string',
      maxLength: 2,
      minLength: 2
    }
  },
  required: [
    'city',
    'country',
    'postalCode',
    'state',
    'streetName'
  ]
}

const lineItemSchema = {
  type: 'object',
  properties: {
    custom: {
      type: 'object',
      required: ['itemTaxes']
    }
  },
  required: ['custom', 'price', 'taxedPrice']
}

// Many values are guaranteed to exist or be of the correct form by CT, so we
// don't need to validate them
const orderSchema = {
  type: 'object',
  properties: {
    shippingAddress: addressSchema,
    bullingAddress: addressSchema,
    lineItems: {
      type: 'array',
      values: lineItemSchema
    },
    custom: {
      type: 'object',
      properties: {
        fields: {
          type: 'object',
          required: [
            'shippingTaxes',
            'loginRadiusUid'
          ]
        }
      },
      required: ['fields']
    }
  },
  required: [
    'billingAddress',
    'custom',
    'customerEmail',
    'locale',
    'orderNumber',
    'shippingAddress',
    'shippingInfo',
    'taxedPrice'
  ]
}

const validateOrder = ajv.compile(orderSchema)

module.exports = {
  validateOrder
}
