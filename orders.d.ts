interface Env {
  [key: string]: string,
  PORT: string,
  SFTP_HOST: string,
  SFTP_PORT: string,
  SFTP_USERNAME: string,
  SFTP_PRIVATE_KEY: string,
  SFTP_INCOMING_ORDERS_PATH: string
}

type Price = {
  type: string,
  currencyCode: string,
  centAmount: number,
  fractionDigits: number
}

type TaxPortion = {
  rate: number,
  amount: Price,
  name: string
}

type LineItem = {
  variant: {
    sku: string,
    prices: Array<{ value: Price }>
  },
  quantity: number,
  custom: {
    fields: {
      isGift: boolean
    }
  },
  taxedPrice?: {
    totalNet: Price,
    totalGross: Price
  }
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
  taxedPrice: Price,
  taxRate: {
    name: string,
    amount: number,
    country: string,
    state: string,
    includedInPrice: boolean
  }
}

type Order = {
  type: string,
  id: string,
  orderNumber: string,
  createdAt: string,
  customerId?: string,
  anonymousId?: string,
  customerEmail: string,
  totalPrice: Price,
  taxedPrice: {
    totalNet: Price,
    totalGross: Price,
    taxPortions: Array<TaxPortion>
  },
  lineItems: Array<LineItem>,
  shippingAddress: Address,
  billingAddress: Address,
  shippingInfo: ShippingInfo,
  locale: string,
  paymentState: string
}

export {
  Env,
  Order
}
