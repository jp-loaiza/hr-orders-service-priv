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
  required: ['firstName', 'lastName', 'streetName', 'postalCode', 'city', 'country']
}

const paymentSchema = {
  type: 'object',
  properties: {
    obj: {
      type: 'object',
      properties: {
        type: 'object',
        required: ['auth_number', 'bin', 'transaction_card_expiry', 'transaction_card_last4', 'transaction_card_type']
      },
      required: ['paymentMethodInfo', 'amountPlanned', 'custom']
    }
  },
  required: ['obj']
}

const lineItemSchema = {
  type: 'object',
  properties: {
    custom: {
      type: 'object',
      required: ['barcodeData']
    }
  },
  required: ['taxedPrice', 'custom', 'price']
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
          required: ['shippingTaxes', 'paymentIsReleased', 'shippingIsRush', 'transactionTotal', 'signatureIsRequired', 'carrierId', 'shippingServiceType', 'returnsAreFree']
        }
      },
      required: ['fields']
    }
  },
  required: ['customerEmail', 'shippingAddress', 'billingAddress', 'orderNumber', 'locale', 'paymentInfo', 'custom']
}

const validateOrder = ajv.compile(orderSchema)

module.exports = {
  validateOrder
}
