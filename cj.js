const { convertToDollars } = require('./csv.utils')

const getLineItemDiscountValue = (/** @type {import('./orders').LineItem} */ lineItem) =>
  lineItem.price.value.centAmount - (lineItem.discountedPrice ? lineItem.discountedPrice.value.centAmount : lineItem.price.value.centAmount)

const getTotalValueOfDiscounts = (/** @type {import('./orders').Order} */ order) =>
  order.lineItems.reduce((/** @type {number} */ total, /** @type {import('./orders').LineItem} */ lineItem) => total + getLineItemDiscountValue(lineItem), 0)

const getUrlParamMappingFromOrder = (/** @type {import('./orders').Order} */ order) => 
  order.lineItems.reduce((mapping, lineItem, index) => ({
    ...mapping,
    [`ITEM${index + 1}`]: lineItem.variant.sku,
    [`AMT${index + 1}`]: convertToDollars(lineItem.discountedPrice ? lineItem.discountedPrice.value.centAmount : lineItem.price.value.centAmount),
    [`QTY${index + 1}`]: lineItem.quantity,
    [`DCNT${index + 1}`]: convertToDollars(getLineItemDiscountValue(lineItem))
  }), {
    CID: process.env.CJ_CID,
    TYPE: process.env.CJ_TYPE,
    method: 'S2S',
    signature: process.env.CJ_SIGNATURE,
    CJEVENT: order.custom.fields.cjEvent,
    eventTime: order.createdAt,
    OID: order.orderNumber,
    currency: 'CAD',
    coupon: order.discountCodes.length > 0 ? order.discountCodes.map(({ discountCode }) => discountCode.id).join(',') : undefined,
    discount: convertToDollars(getTotalValueOfDiscounts(order)),
    amount: convertToDollars(order.taxedPrice.totalNet.centAmount - order.shippingInfo.price.centAmount) // total price of order excluding shipping and taxes
  })

module.exports = {
  getUrlParamMappingFromOrder
}
