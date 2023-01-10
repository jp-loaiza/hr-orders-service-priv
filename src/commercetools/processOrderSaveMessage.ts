import { OrderSaveMessage } from "../events/OrderSaveMessage";
import { apiRoot } from "../commercetools/ctClientV2";

export const processOrderSaveMessage = async (msg: OrderSaveMessage) => {
  try {
    const { body: { version } } = await apiRoot.orders().withOrderNumber({orderNumber: msg.ORDER_NUMBER}).get().execute()
    await apiRoot.orders().withOrderNumber({orderNumber: msg.ORDER_NUMBER}).post({
      body: {
        actions: msg.ACTIONS,
        version,
      },
    })
    .execute()
  } catch (error: any) {
    throw new Error(error)
  }
}