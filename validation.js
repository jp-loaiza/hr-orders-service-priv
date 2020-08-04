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
  required: [
    'city',
    'country',
    'firstName',
    'lastName',
    'postalCode',
    'state',
    'streetName'
  ]
}

const paymentSchema = {
  type: 'object',
  properties: {
    obj: {
      type: 'object',
      required: ['amountPlanned', 'custom', 'paymentMethodInfo']
    }
  },
  required: ['obj']
}

const lineItemSchema = {
  type: 'object',
  properties: {
    custom: {
      type: 'object',
      required: ['barcodeData', 'itemTaxes']
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
    paymentInfo: {
      type: 'object',
      properties: {
        payments: {
          type: 'array',
          values: paymentSchema
        }
      },
      required: ['payments']
    },
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
            'carrierId',
            'paymentIsReleased',
            'returnsAreFree',
            'shippingIsRush',
            'signatureIsRequired',
            'shippingServiceType',
            'shippingTaxes',
            'transactionTotal'
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
    'paymentInfo',
    'shippingAddress',
    'shippingInfo',
    'taxedPrice'
  ]
}

const validateOrder = ajv.compile(orderSchema)

module.exports = {
  validateOrder
}
