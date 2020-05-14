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
  price: { value: Price }
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
      }>
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

type PaymentInfo = {
    paymentMethodInfo: {
      method: string
    },
    amountPlanned: {
      centAmount: number
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
  shippingInfo: ShippingInfo,
  locale: 'en-CA' | 'fr-CA',
  paymentState: string,
  paymentInfo: Array<PaymentInfo>
}

type ShippingServiceKey = 'EXPRESS' | 'SHIPMENT' | 'EXPEDITED_PARCEL' | 'XPRESSPOST'

type CarrierName = 'Canada Post' | 'FedEx' | 'Purolator' | 'DHL' | 'USPS' | 'UPS'

export {
  CarrierName,
  Env,
  LineItem,
  Order,
  PaymentInfo,
  ShippingInfo,
  ShippingServiceKey
}
