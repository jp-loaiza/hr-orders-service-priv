type StateCode = 'BC' | 'SK' | 'MB' | 'ON' | 'QC' | 'NB' | 'NL' | 'NS' | 'PE'
type TaxDescriptionKey = 'GST' | 'PST_BC' | 'PST_SK' | 'PST_MB' | 'HST_ON' | 'QST_QC' | 'HST_NB' | 'HST_NL' | 'HST_NS' | 'HST_PE'
type BoldTaxDescription = 'GST' | 'HST' | 'PST' | 'QST'
type Card = 'visa' | 'mastercard' | 'american-express' | 'diners-club' | 'discover' | 'jcb'

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
  EMAIL_API_PASSWORD: string,
  NOTIFICATIONS_BEARER_TOKEN: string,
  HEALTHZ_AUTHORIZATION: string,
  NEWRELIC_APP_NAME: string,
  NEWRELIC_LICENSE_KEY: string
  SHOULD_UPLOAD_ORDERS: string,
  SHOULD_SEND_NOTIFICATIONS: string,
  JOB_TASK_TIMEOUT: string,
  MAXIMUM_RETRIES: string
}

type Price = {
  type: string,
  currencyCode: string,
  centAmount: number,
  fractionDigits: number
}

type TaxedPrice = {
  totalNet: Price,
  totalGross: Price,
  taxPortions: Array<{
    rate: number,
    amount: Price,
    name: string
  }>
}

type TaxRate = {
  name: string,
  amount: number,
  country: string,
  includedInPrice: boolean
}

type Barcode = {
  obj: {
    value: {
      subType: string,
      barcode: string
    }
  }
}

type LineItem = {
  id: string,
  variant: {
    sku: string,
    prices: Array<{ value: Price }>,
    attributes: Array<{
      name: string,
      value: any
    }>
  },
  price: { value: Price },
  totalPrice: Price,
  quantity: number,
  custom: {
    fields: {
      isGift: boolean
      salespersonId?: number,
      itemTaxes: string // stringified JSON
      lineShippingCharges?: Price
    }
  },
  taxedPrice: TaxedPrice,
  taxRate: TaxRate
}

type Address = {
  streetName: string,
  postalCode: string,
  city: string,
  state: StateCode,
  country: string,
  firstName: string,
  lastName: string,
  phone: string,
  additionalAddressInfo?: string
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
        auth_number: string,
        bin: string,
        transaction_card_expiry: string,
        transaction_card_last4: string,
        transaction_card_type: Card
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
  shippingInfo: ShippingInfo, 
  taxedPrice: TaxedPrice
  custom: {
    fields: {
      sentToOmsStatus: 'PENDING' | 'SUCCESS' | 'FAILURE',
      errorMessage?: string,
      shippingTaxes: string, // stringified JSON
      paymentIsReleased: boolean,
      shippingIsRush: boolean,
      transactionTotal: Price,
      signatureIsRequired: boolean,
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

type ParsedTax = {
  dollarAmount: number,
  description: string
}

export {
  Address,
  Barcode,
  BoldTaxDescription,
  Card,
  Env,
  LineItem,
  Order,
  ParsedTax,
  Payment,
  ShippingInfo,
  StateCode,
  TaxDescriptionKey,
  TaxedPrice
}
