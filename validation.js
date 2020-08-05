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

const paymentSchema = {
  type: 'object',
  properties: {
    obj: {
      type: 'object',
      properties: {
        type: 'object',
        required: ['cardReferenceNumber', 'cardExpiryDate', 'cardNumber', 'authorizationNumber']
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
          required: ['shippingTax', 'shippingTaxDescription', 'paymentIsReleased', 'shippingCost', 'shippingIsRush', 'transactionTotal', 'signatureIsRequired', 'totalOrderTax', 'carrierId', 'shippingServiceType', 'returnsAreFree']
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
