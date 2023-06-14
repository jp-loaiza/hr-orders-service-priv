export const convertOrderForNarvar = jest.fn().mockReturnValue(Promise.resolve({
  order_info: {
    order_number: 'order.orderNumber',
    order_date: 'order.custom.fields.orderDate || order.createdAt',
    status: 'READY_FOR_PICKUP',
    currency_code: 'order.totalPrice.currencyCode',
    checkout_locale: 'locale',
    order_items: 'convertItems',
    shipments: 'convertShipments',
    pickups: 'convertPickups',
    billing: {
      billed_to: {
        first_name: 'order.billingAddress.firstName',
        last_name: 'order.billingAddress.lastName',
        phone: 'order.billingAddress.phone',
        email: 'order.billingAddress.email',
        address: {
          street_1: 'order.billingAddress.streetName',
          city: 'order.billingAddress.city',
          state: 'order.billingAddress.state',
          zip: 'order.billingAddress.postalCode',
          country: 'order.billingAddress.country'
        },
      },
      amount: '(order.taxedPrice.totalGross.centAmount / 100.0)',
      tax_amount: '((order.taxedPrice.totalGross.centAmount - order.taxedPrice.totalNet.centAmount) / 100.0)',
      shipping_handling: '(order.shippingInfo.shippingRate.price.centAmount / 100)'
    },
    customer: {
      first_name: 'order.shippingAddress.firstName',
      last_name: 'order.shippingAddress.lastName',
      customer_id: 'order.custom.fields.loginRadiusUid',
      phone: 'order.shippingAddress.phone',
      email: 'order.shippingAddress.email',
      address: {
        street_1: 'order.shippingAddress.streetName',
        city: 'order.shippingAddress.city',
        state: 'order.shippingAddress.state',
        zip: 'order.shippingAddress.postalCode',
        country: 'order.shippingAddress.country'
      }
    },
    attributes: {
      orderLastModifiedDate: 'order.custom.fields.orderLastModifiedDate || order.createdAt',
      shipping_tax1: 'order.custom.fields.shippingTax1 ? (order.custom.fields.shippingTax1.centAmount / 100).toString() : 0',
      shipping_tax2: 'order.custom.fields.shippingTax2 ? (order.custom.fields.shippingTax2.centAmount / 100).toString() : 0',
      siteId: 'order.custom.fields.cartSourceWebsite || 00990',
      isStorePickup: 'isStorePickup',
      subtotal: '((order.taxedPrice.totalNet.centAmount - order.shippingInfo.shippingRate.price.centAmount) / 100).toString()'
    },
    is_shoprunner_eligible: false,
  }
}))
export const sendToNarvar = jest.fn()
export const shouldSendToNarvarFinalCut = jest.fn()
