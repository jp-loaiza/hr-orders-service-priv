interface Env {
  [key: string]: string,
  PORT: string,
  SFTP_HOST: string,
  SFTP_PORT: string,
  SFTP_USERNAME: string,
  SFTP_PRIVATE_KEY: string,
  SFTP_INCOMING_ORDERS_PATH: string,
  ORDER_UPLOAD_INTERVAL: string
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
      itemTaxes: string // stringified JSON
      lineShippingCharges?: Price
    }
  },
  taxedPrice: TaxedPrice,
  taxRate: TaxRate
}

type Address = {
  streetName: string,
  streetNumber: string,
  postalCode: string,
  apartment: string,
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
        auth_number: string,
        bin: string,
        transaction_card_expiry: string,
        transaction_card_last4: string,
        transaction_card_type: string
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
  Env,
  LineItem,
  Order,
  ParsedTax,
  Payment,
  ShippingInfo,
  TaxedPrice
}
