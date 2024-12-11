import { Order, LineItem } from "@commercetools/platform-sdk";
import logger from "../logger";

const baseUrl = process.env.BOLD_BASE_URL
const boldShopIdentifier = process.env.BOLD_SHOP_IDENTIFIER
const boldApiToken = process.env.BOLD_API_TOKEN

export const prepareOrderForBold = (order: Order) => {
  logger.info("prepareOrderForBold for order " + order.orderNumber )

  const results = formatLineItems(order.lineItems)
  const payload = {
    "line_items": results
  }

  logger.info("Bold payload: " + JSON.stringify(payload))

  return payload
}

const formatLineItems = (lineItems: LineItem[]) => {
  return lineItems.map(item => ({
    "line_item_key": item.id,
    "fulfilled_quantity": item.quantity
  }))
}

export const sendToBold = async (payload: any, public_order_id: string) => {
  const url = `${baseUrl}/checkout/orders/${boldShopIdentifier}/${public_order_id}/line_items`

  const options = {
    body: JSON.stringify(payload),
    headers: {
      Authorization: `${boldApiToken}`,
      'Content-Type': 'application/json'
    },
    method: 'PATCH'
  }

  const response = await fetch(url, options)
  let result

  try {
    result = await response.json()
  } catch (err) {
    throw new Error(`Invalid JSON response, ${err.message}`)
  }

  if (response.ok) {
    if (result.status === 'FAILURE') {
      throw new Error(JSON.stringify(result))
    }
    return response
  }
  throw new Error(JSON.stringify(result))
}