/**
 * @param {import('./orders').Order} order
 * @returns {import('./orders').DynamicYieldReportEventData | undefined}
 */
const getDYReportEventFromOrder = order => {
  const { dynamicYieldData } = order.custom && order.custom.fields || {}
  if (!(dynamicYieldData && dynamicYieldData.user && dynamicYieldData.user.dyid)) {
    return undefined
  }

  const purchaseEvent = {
    name: 'Purchase',
    properties: {
      dyType: 'purchase-v1',
      uniqueTransactionId: order.id,
      value: convertToDollars(order.totalPrice),
      currency: 'CAD',
      cart: order.lineItems.map(convertLineItemToDYCartItem)
    }
  }

  return {
    ...dynamicYieldData,
    events: [purchaseEvent]
  }
}

/**
 * @param {import('./orders').LineItem} lineItem
 * @returns {import('./orders').DynamicYieldCartItem}
 */
const convertLineItemToDYCartItem = (lineItem) => {
  return {
    productId: lineItem.variant.sku,
    quantity: lineItem.quantity,
    itemPrice: getLineItemPriceInDollars(lineItem)
  }
}

/**
 * @param {import('./orders').LineItem} lineItem
 * @returns {number}
 */
const getLineItemPriceInDollars = (lineItem) => {
  const centAmount = lineItem.discountedPrice
    ? lineItem.discountedPrice.value.centAmount

    : lineItem.price.value.centAmount
  return convertToDollars(centAmount)
}

/**
 * @param {number} centAmount
 * @returns {number}
 */
const convertToDollars = (centAmount) => {
  return centAmount / 100
}

module.exports = {
  getDYReportEventFromOrder
}
