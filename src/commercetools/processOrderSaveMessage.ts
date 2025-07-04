import { OrderSaveMessage } from "../events/OrderSaveMessage";
import { apiRoot } from "../commercetools/ctClientV2";
import logger, { serializeError } from '../logger'

export const processOrderSaveMessage = async (msg: OrderSaveMessage) => {
  try {
    const { body: { version } } = await apiRoot.orders().withOrderNumber({ orderNumber: msg.ORDER_NUMBER }).get().execute()
    logger.info(`ProcessOrderSave start, Order number: ${msg.ORDER_NUMBER}, version: ${version}, actions: ${JSON.stringify(msg.ACTIONS)}`)
    await apiRoot.orders().withOrderNumber({ orderNumber: msg.ORDER_NUMBER }).post({
      body: {
        actions: msg.ACTIONS,
        version,
      },
    })
      .execute()
    logger.info(`ProcessOrderSave succeed, Order number: ${msg.ORDER_NUMBER}`)
  } catch (error) {
    logger.error({
      type: 'process_order_save',
      message: `ProcessOrderSave failed, Order number: ${msg.ORDER_NUMBER}`,
      error: serializeError(error)
    })
  }
}