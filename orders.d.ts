interface Env {
  [key: string]: string,
  PORT: string,
  SFTP_HOST: string,
  SFTP_PORT: string,
  SFTP_USERNAME: string,
  SFTP_PRIVATE_KEY: string,
  SFTP_INCOMING_ORDERS_PATH: string,
  ORDER_UPLOAD_INTERVAL: string,
  EMAIL_API_URL: string,
  EMAIL_API_USERNAME: string,
  EMAIL_API_PASSWORD: string
}

type Price = {
  type: string,
  currencyCode: string,
  centAmount: number,
  fractionDigits: number
}

type TaxedPrice = {
  totalNet: Price,
  totalGross: Price
}

type TaxRate = {
  name: string,
  amount: number,
  country: string,
  includedInPrice: boolean
}

type LineItem = {
  id: string,
  variant: {
    sku: string,
    prices: Array<{ value: Price }>
  },
  price: { value: Price },
  totalPrice: Price,
  quantity: number,
  custom: {
    fields: {
      isGift: boolean
      barcodeData: Array<{
        obj: {
          value: {
            subType: string,
            barcode: string
          }
        }
      }>,
      salespersonId?: number,
      lineTaxDescription: string,
      lineTotalTax: Price,
      lineShippingCharges: Price
    }
  },
  taxedPrice: TaxedPrice,
  taxRate: TaxRate
}

type Address = {
  additionalStreetInfo: string,
  postalCode: string,
  city: string,
  state: string,
  country: string,
  firstName: string,
  lastName: string,
  phone: string
}

type ShippingInfo = {
  shippingMethodName: string,
  shippingRate: { price: Price },
  price: Price,
  taxedPrice: TaxedPrice,
  taxRate: TaxRate
}

type Payment = {
  obj: {
    paymentMethodInfo: {
      method: string
    },
    amountPlanned: {
      centAmount: number
    },
    custom: {
      fields: {
        cardReferenceNumber: string,
        cardExpiryDate: string,
        cardNumber: string,
        authorizationNumber: string
      }
    }
  }
}

type Order = {
  version: number,
  type: string,
  id: string,
  orderNumber: string,
  createdAt: string,
  customerId?: string,
  anonymousId?: string,
  customerEmail: string,
  totalPrice: Price,
  lineItems: Array<LineItem>,
  shippingAddress: Address,
  billingAddress: Address,
  locale: 'en-CA' | 'fr-CA',
  paymentInfo: {
    payments: Array<Payment>
  },
  custom: {
    fields: {
      sentToOmsStatus?: 'PENDING' | 'SUCCESS' | 'FAILURE',
      errorMessage?: string,
      shippingTax: Price,
      shippingTaxDescription: string,
      paymentIsReleased: boolean,
      shippingCost: Price,
      shippingIsRush: boolean,
      transactionTotal: Price,
      signatureIsRequired: boolean,
      totalOrderTax: Price,
      carrierId:  'CP' | 'FDX' | 'PUR' | 'DHL' | 'USPS' | 'UPS',
      shippingServiceType: 'EXPRESS' | 'SHIPMENT' | 'EXPEDITED PARCEL' | 'XPRESSPOST',
      returnsAreFree: boolean,
      destinationSiteId?: string,
      retryCount?: number,
      nextRetryAt?: string,
      loginRadiusUid: string
    }
  }
}

export {
  Env,
  LineItem,
  Order,
  Payment,
  ShippingInfo
}
