/**
 * Message from order-save topic commercetools-order-save.
 *
 * Example:
 * ```ts

{
	"MESSAGE_KEY": "2ed24c58-9251-4d48-a2f0-ef886fb23a81",
	"TIMESTAMP": 1672951035,
	"ORDER_NUMBER": "77758201",
	"VERSION": 15,
	"ACTIONS": [
		{
			"action": "setCustomField",
			"name": "sentToOmsStatus",
			"value": "PENDING"
		}
	]
}

 * ```
 */
import { OrderUpdateAction } from '@commercetools/platform-sdk'
export interface OrderSaveMessage {
  MESSAGE_KEY: string
  TIMESTAMP: number, // When update action is required but not yet ran
  LASTMODIFIEDDATE: number,
  ORDER_NUMBER: string,
  VERSION: number,
  ACTIONS: OrderUpdateAction[]
}
