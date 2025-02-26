import { CustomFields, Order, Customer } from '@commercetools/platform-sdk'

type StateCode = 'BC' | 'SK' | 'MB' | 'ON' | 'QC' | 'NB' | 'NL' | 'NS' | 'PE'
type TaxDescriptionKey = 'GST' | 'PST_BC' | 'PST_SK' | 'PST_MB' | 'HST_ON' | 'QST_QC' | 'HST_NB' | 'HST_NL' | 'HST_NS' | 'HST_PE'
type BoldTaxDescription = 'GST' | 'HST' | 'PST' | 'QST'
type Card = 'visa' | 'mastercard' | 'american-express' | 'diners-club' | 'discover' | 'jcb'
type NarvarFulfillmentStatuses = 'FULFILLED' | 'NOT_SHIPPED' | 'SHIPPED' | 'CANCELLED' | 'RETURNED' | 'PARTIAL' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'DELAYED' | 'PICKED_UP' | 'NOT_PICKED_UP'
type CommerceToolsOrderStates = 'SHIPPED' | 'IN PICKING' | 'HOLD' | 'OPEN' | 'CANCELLED'
type LocaleType = 'en-CA' | 'fr-CA'
type PaymentState = 'Pending' | 'Paid'
type SentToOmsStatus = 'PENDING' | 'SUCCESS' | 'FAILURE'
type OmsUpdate = 'PENDING' | 'SUCCESS' | 'FAILURE'
type CarrierId = 'CP' | 'FDX' | 'PUR' | 'DHL' | 'USPS' | 'UPS'
type ShippingServiceType = 'EXPRESS' | 'SHIPMENT' | 'EXPEDITED PARCEL' | 'XPRESSPOST'

interface Env {
  [key: string]: string,
  ENVIRONMENT: string,
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
  SHOULD_UPLOAD_ORDERS: string,
  SHOULD_CHECK_FOR_STUCK_ORDERS: string,
  SHOULD_SEND_NOTIFICATIONS: string,
  STALE_ORDER_CUTOFF_TIME_MS: string,
  STUCK_ORDER_CHECK_INTERVAL: string,
  JOB_TASK_TIMEOUT: string,
  MAXIMUM_RETRIES: string,
  SHOULD_SEND_ORDER_UPDATES: string,
  JESTA_API_HOST: string,
  JESTA_API_USERNAME: string,
  JESTA_API_PASSWORD: string,
  DYNAMIC_YIELD_API_KEY_SERVER: string,
  SEND_DYNAMIC_YIELD_INFO_INTERVAL: string,
  SHOULD_SEND_DYNAMIC_YIELD_INFO: string
}

type NarvarOrder = {
  order_info: {
    order_number?: string,
    order_date: string,
    status: string | CommerceToolsOrderStates[],
    currency_code: string,
    checkout_locale?: string,
    order_items: Array<NarvarOrderItem>,
    shipments?: Array<NarvarShipment>,
    pickups?: Array<NarvarPickup>,
    billing: NarvarBilling,
    customer: NarvarCustomer,
    attributes: { [key: string]: string | boolean },
    is_shoprunner_eligible: Boolean,
  }
}

type NarvarOrderItem = {
  item_id: string,
  name: string,
  quantity: number,
  categories: Array<string>,
  item_image?: string,
  item_url?: string,
  sku?: string,
  is_final_sale: boolean,
  unit_price: number,
  discount_amount: number | null,
  discount_percent: number | null,
  line_price: number,
  fulfillment_type: string,
  fulfillment_status: string,
  is_gift: boolean,
  final_sale_date: string,
  line_number?: number,
  attributes: { [key: string]: string | null },
  vendors: Array<{
    name: string,
    phone?: string,
    adddress?: string
  }>
}

type NarvarShipment = {
  id: string,
  items_info: Array<NarvarItemsInfo>,
  tracking_number: string | null,
  carrier: string | null,
  shipped_to: NarvarShippedTo,
  ship_date: string | null,
  carrier_service: string | null,
  shipped_from: NarvarShippedFrom,
  attributes: { [key: string]: string },
}

type NarvarPickup = {
  id: string,
  items_info: Array<NarvarItemsInfo>,
  status: {
    code: string,
    date: string
  },
  attributes: { [key: string]: string },
  store: {
    id: string,
    address: NarvarAddress,
    phone_number?: string
  },
  type: string
}

type NarvarItemsInfo = {
  item_id: string,
  sku?: string,
  quantity: number
}

type NarvarBilling = {
  billed_to: NarvarShippedTo, // SIC as per Narvar API spec
  amount: number,
  tax_amount: number,
  shipping_handling: number
}

type NarvarCustomer = {
  first_name: string,
  last_name: string,
  customer_id: string,
  phone: string,
  email: string,
  address: NarvarAddress
}

type NarvarShippedTo = {
  first_name?: string,
  last_name?: string,
  phone?: string,
  email?: string,
  address?: NarvarAddress,

}

type NarvarShippedFrom = {
  first_name: string,
  last_name: string,
  phone: string,
  address: NarvarAddress,

}

type NarvarAddress = {
  street_1?: string,
  street_2?: string,
  city?: string,
  state?: string,
  zip?: string,
  country?: string
}

type OrderState = {
  id: string,
  name: {
    'en-CA': CommerceToolsOrderStates,
    'fr-CA': CommerceToolsOrderStates
  }
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
      barcode: string,
      effectiveAt?: string,
      expiresAt?: string
    }
  }
}

type AlgoliaAnalyticsData = {
  userToken: string,
  index: string,
  eventName: string,
  eventType?: string
  queryID?: string,
  objectIDs: Array<string>
}

type DynamicYieldCustomFieldData = {
  user: {
    dyid: string
  },
  session: {
    dy: string
  }
}

type DynamicYieldReportEventData = DynamicYieldCustomFieldData & {
  events: Array<DynamicYieldEvent<DynamicYieldPurchaseEventProperties>>
}

type DynamicYieldEvent<E> = {
  name: string
  properties: E
}

type DynamicYieldPurchaseEventProperties = {
  dyType: 'purchase-v1',
  uniqueTransactionId: string,
  value: number,
  currency?: 'CAD',
  cart: Array<DynamicYieldCartItem>
}

type DynamicYieldCartItem = {
  productId: string,
  quantity: number,
  itemPrice: number,
  size?: string
}

type LineItem = {
  id: string,
  productId: string,
  name: { 'en-CA': string, 'fr-CA': string },
  productSlug: { 'en-CA': string, 'fr-CA': string },
  variant: {
    sku: string,
    prices: Array<{ value: Price }>,
    images: Array<{ url: string }>
    attributes: Array<{
      name: string,
      value: any
    }>
  },
  state: Array<{ quantity: number, state: { typeId: string, id: string } }>,
  price: { value: Price },
  discountedPrice?: { value: Price }
  totalPrice: Price,
  quantity: number,
  custom: {
    fields: {
      isGift: boolean
      salespersonId?: number,
      itemTaxes: string // stringified JSON
      lineShippingCharges?: Price,
      orderDetailLastModifiedDate: string,
      category?: string,
      reasonCode?: string,
      algoliaAnalyticsData?: {
        obj: {
          value: AlgoliaAnalyticsData
        }
      }
    }
  },
  taxedPrice: TaxedPrice,
  taxRate: TaxRate,
  lastModifiedAt: string,
  product_type: string | null,
  product_id: string | null,
  dimensions: null,
  is_backordered: null,
  vendor: null,
  item_promise_date: null,
  return_reason_code: null,
  events: null,
  color: string | null,
  size: string | null,
  style: string | null,
  original_unit_price: number | null,
  original_line_price: null,
  narvar_convert_id: null
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
  additionalAddressInfo?: string,
  email: string
}

type ShippingInfo = {
  shippingMethodName: string,
  shippingRate: { price: Price },
  price: Price,
  taxedPrice: TaxedPrice,
  taxRate: TaxRate
}

type Transaction = {
  type: string,
  state: string
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
        transaction_card_type: Card,
        user_agent_string: string;
      }
    },
    paymentStatus: {
      state: {
        obj: {
          key: string
        }
      },
      interfaceCode: string,
    }
    transactions: Array<Transaction>
  }
}

type PaymentInfo = {
  payments: Array<Payment>
}

export interface Custom extends CustomFields {
  cjNextRetryAt?: string
  sentToCjStatus?: string
  segmentNextRetryAt?: string
  segmentStatus?: string
  narvarNextRetryAt?: string
  narvarStatus?: string
  dynamicYieldPurchaseNextRetryAt?: string
  sentToDynamicYieldStatus?: string
  sentToAlgoliaStatus?: string,
  createdAt?: string
  sentToCrmStatus?: string
  omsUpdatedStatus?: string
  userEmailDomain: string,
  orderLastModifiedDate: string,
  cjEvent?: string,
  cartSourceWebsite?: string,
  sentToOmsStatus: SentToOmsStatus,
  omsUpdate: OmsUpdate,
  omsUpdateNextRetryAt?: string,
  omsUpdateRetryCount?: number,
  errorMessage?: string,
  shippingTaxes: string, // stringified JSON
  paymentIsReleased: boolean,
  shippingIsRush: boolean,
  transactionTotal: Price,
  signatureIsRequired: boolean,
  carrierId: CarrierId,
  shippingServiceType: ShippingServiceType,
  returnsAreFree: boolean,
  destinationSiteId?: string,
  retryCount?: number,
  nextRetryAt?: string,
  loginRadiusUid: string,
  isStorePickup: boolean,
  dynamicYieldData?: {
    obj: {
      value: DynamicYieldCustomFieldData
    }
  },
  giftMessage: string,
  orderDate?: string,
  orderCreatedDate?: string,
  shippingTax1?: string,
  shippingTax2?: string,
  reasonCode?: string,
  segmentLastSuccessTime?: string,
  segmentOrderState?: string,
  segmentAjsAnonymousId?: string
}

export interface IOrder extends Order {
  custom?: Custom
}

export type OrderUpdate = {
  orderNumber?: string,
  status?: 'success' | 'released' | 'cancelled' | 'refunded',
  errorMessage?: string
}

type Shipment = {
  
  id: string,
  createdAt: string,
  value: {
    fillSiteId: string,
    destinationSiteId: string,
    shipmentId: string,
    shipmentLastModifiedDate: string,
    fromZipCode?: string,
    fromAddress1?: string,
    fromAddress2?: string,
    fromCity?: string,
    fromCountryId?: string,
    fromHomePhone?: string,
    fromStateId?: string,
    fromStoreName?: string,
    trackingNumber?: string,
    orderNumber?: string,
    shipmentItemLastModifiedDate?: string,
    shipmentDetails: Array<{
      shipmentDetailLastModifiedDate?: string
      siteId: string,
      line: number,
      businessUnitId: string,
      status: string, // TODO: commercetools lineitem state
      quantityShipped: number,
      lineItemId: string,
      shipmentDetailId: string,
      carrierId?: string,
      trackingNumber?: string,
      serviceType?: string,
      shippedDate?: string
    }>
  }
}

type ProductVariant = {
  id: number
}

type ProductDetails = {
  name: {
    'en-CA': string,
    'fr-CA': string,
  },
  description: {
    'en-CA': string,
    'fr-CA': string,
  },
  categories: Array<{
    typeId: string,
    id: string
  }>,
  slug: {
    'en-CA': string,
    'fr-CA': string,
  },
  masterVariant: ProductVariant
}

type Product = {
  id: string,
  createdAt: string,
  lastModifiedAt: string,
  masterData: {
    current: ProductDetails,
    staged: ProductDetails,
    published: boolean,
    hasStagedChanges: boolean
  },
  key: string
  taxCategory: {
    typeId: string,
    id: string
  },
  lastVariantId: number
}

type ProductCategory = {
  key: string,
  name: {
    'en-CA': string,
    'fr-CA': string
  }
}

type ParsedTax = {
  dollarAmount: number,
  description: string
}

type JestaApiResponseBody = null | undefined | {
  '@odata.context'?: string,
  ReturnCode?: number,
  ReturnMessage?: string
}

type tCARD_TYPES_TO_JESTA_CODES = {
  [key: string]: string
}

export {
  Address,
  AlgoliaAnalyticsData,
  Barcode,
  BoldTaxDescription,
  Card,
  DynamicYieldCartItem,
  DynamicYieldReportEventData,
  Env,
  JestaApiResponseBody,
  LineItem,
  Order,
  ParsedTax,
  Payment,
  PaymentInfo,
  ShippingInfo,
  StateCode,
  TaxDescriptionKey,
  TaxedPrice,
  Transaction,
  NarvarOrder,
  NarvarOrderItem,
  NarvarShipment,
  NarvarPickup,
  OrderState,
  CommerceToolsOrderStates,
  Shipment,
  tCARD_TYPES_TO_JESTA_CODES,
  Product,
  ProductCategory,
  LocaleType,
  PaymentState,
  SentToOmsStatus,
  OmsUpdate,
  CarrierId,
  ShippingServiceType,
  Customer,
}
