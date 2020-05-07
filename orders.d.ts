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
  }
}

type Address = {
  additionalStreetInfo: string,
  postalCode: string,
  city: string,
  state: string,
  country: string
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
  billingAddress: Address
}

export {
  Env,
  Order
}
