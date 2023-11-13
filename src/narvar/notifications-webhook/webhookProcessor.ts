import { fetchShipments, fetchShipmentsByTrackingNumber, updateOrder, updateShipment } from "../../commercetools/commercetools";
import { Shipment } from "../../orders";
import tracer from "../../tracer";
import { WebhookNotification } from "./WebhookNotification";
import { DELIVERED_ORDER_STATUS, DELIVERED_STATUS, NARVAR_DELIVERED_NOTIFICATION_TYPE } from "./constants";

export async function processWebhookData(webhookData: WebhookNotification): Promise<void> {
    await tracer.trace('narvar_webhook_processor', { resource: 'process_webhook_data' }, async () => { 
        if(webhookData.notification_type === NARVAR_DELIVERED_NOTIFICATION_TYPE) {
            const shipments = await fetchShipmentsByTrackingNumber(webhookData.notification_triggered_by_tracking_number)

            await updateShipmentsToDelivered(shipments, webhookData.notification_triggered_by_tracking_number);
        
            await updateOrderDelivered(webhookData.order);    
        }   
    })
}

/**
 * Receives an array of `shipments` and the webhook data and updates all the `shipmentDetails` that 
 * matches the `webhookData.notification_triggered_by_tracking_number` to `DELIVERED`
 *
 * @param {import('../orders').Shipment} shipments commerceTools shipments that matches the tracking number
 * @param {WebhookNotification["notification_triggered_by_tracking_number"]} narvarTrackingNumber the payload received from Narvar
 */
async function updateShipmentsToDelivered(shipments: Shipment[], narvarTrackingNumber: WebhookNotification["notification_triggered_by_tracking_number"]) {
    let isShipmentUpdated;
    for (const shipment of shipments) {
        isShipmentUpdated = false;
        for (const shipmentDetail of shipment.value.shipmentDetails) {
            if (shipmentDetail.trackingNumber === narvarTrackingNumber) {
                shipmentDetail.status = DELIVERED_STATUS;
                const lastModifedDate = new Date().toISOString();
                shipmentDetail.shipmentDetailLastModifiedDate = lastModifedDate;
                shipment.value.shipmentLastModifiedDate = lastModifedDate;
                shipment.value.shipmentItemLastModifiedDate = lastModifedDate;
                isShipmentUpdated = true;
            }
        }
        if (isShipmentUpdated) {
            await updateShipment(shipment);
        }
    }
}

/**
 * Checks all order shipments and updates the order to Delivered if ALL shipments are with the `DELIVERED` status
 *
 * @param {WebhookNotification["order"]} narvarOrder Order Data received from Narvar
 */
async function updateOrderDelivered(narvarOrder: WebhookNotification["order"]) {
    const orderNumber = narvarOrder?.order_number;
    if (orderNumber) {
        let isOrderDelivered = true;
        const shipments = await fetchShipments(orderNumber);
        for (const shipment of shipments) {
            for (const shipmentDetail of shipment.value.shipmentDetails) {
                if (shipmentDetail.status !== DELIVERED_STATUS) {
                    isOrderDelivered = false;
                }
            }
        }

        if (isOrderDelivered) {
            const statusUpdateAction = { action: 'transitionState', state: { key: DELIVERED_ORDER_STATUS }, force: true };
            await updateOrder(orderNumber, [statusUpdateAction]);
        }
    }
}
