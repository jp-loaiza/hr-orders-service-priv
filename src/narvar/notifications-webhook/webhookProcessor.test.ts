
import { updateOrder, updateShipment } from "../../commercetools/commercetools"
import { processWebhookData } from "./webhookProcessor"


let fetchShipmentsByTrackingNumber = require("../../commercetools/commercetools").fetchShipmentsByTrackingNumber
let fetchShipments = require("../../commercetools/commercetools").fetchShipments
jest.mock('../../commercetools/commercetools', () => ({
    fetchShipmentsByTrackingNumber: jest.fn(),
    updateShipment: jest.fn(),
    fetchShipments: jest.fn(),
    updateOrder: jest.fn()

  }))


describe('processWebhook Notification', () => {

    const mockShipments = [
        {
            "id": "0d10ab8d-be62-4c1c-b712-463014f11b2f",
            "version": 4,
            "versionModifiedAt": "2023-11-08T19:09:21.815Z",
            "createdAt": "2023-11-08T18:52:30.668Z",
            "lastModifiedAt": "2023-11-08T19:09:21.815Z",
            "lastModifiedBy": {
                "clientId": "ZDe2PC-RyM7BgMRYeGnk7frj",
                "isPlatformClient": false
            },
            "createdBy": {
                "clientId": "ZDe2PC-RyM7BgMRYeGnk7frj",
                "isPlatformClient": false
            },
            "container": "shipments",
            "key": "648613",
            "value": {
                "carrierId": "FDX",
                "fillSiteId": "00033",
                "fromZipCode": "K1N 9J8",
                "fromStoreName": "033 - Rideau Centre",
                "fromHomePhone": "613-230-7232",
                "fromAddress1": "50 Rideau Street Unit 0333A",
                "fromCity": "Ottawa",
                "fromStateId": "ON",
                "fromCountryId": "CA",
                "trackingNumber": "786110642799",
                "orderNumber": "86758065",
                "serviceType": "ECONOMY",
                "shipmentLastModifiedDate": "2023-11-08T14:08:34.000Z",
                "shipmentId": "648613",
                "shipmentItemLastModifiedDate": "2023-11-08T14:08:33.000Z",
                "orderCreatedDate": "2023-07-06T17:13:18.000Z",
                "shipmentDetails": [
                    {
                        "shipmentId": "648613",
                        "siteId": "00990",
                        "line": "1",
                        "businessUnitId": "1",
                        "status": "SHIPPED",
                        "orderNumber": "86758065",
                        "trackingNumber": "786110642799",
                        "carrierId": "FDX",
                        "quantityShipped": 1,
                        "lineItemId": "21126f06-1180-4779-b676-7de50be1cc11",
                        "shipmentDetailLastModifiedDate": "2023-11-08T14:08:33.000Z",
                        "shippedDate": "2023-11-08T14:08:33.000Z",
                        "serviceType": "ECONOMY",
                        "shipmentDetailId": "648613-00990-1-1"
                    }
                ]
            }
        }
    ]

    const mockNonProccesableNotification = { 
        "version": "v1-notification-webhook",
        "narvar_tracer_id": "2f0540e7cd454477b1d74aebe0082f09",
        "notification_type": "mockFailure",
        "notification_triggered_by_tracking_number": "786110642799",
        "published_date": "2018-12-25T08:15:55.106Z"
    }

    const mockNotification = {
        "version": "v1-notification-webhook",
        "narvar_tracer_id": "2f0540e7cd454477b1d74aebe0082f09",
        "notification_type": "delivered_standard",
        "notification_triggered_by_tracking_number": "786110642799",
        "notification_locale": "en_US",
        "notification_date": "2018-12-25T08:09:25.394Z",
        "order": {
            "order_number": "86758065",
            "placement_date": "2018-12-23T22:49:53.199Z",
            "billing_document": {
                "billed_to": {
                    "first_name": "James",
                    "last_name": "Johnson",
                    "phone": "5555552368",
                    "phone_extension": "157",
                    "email": "noreply@narvar.com",
                    "fax": "5555552368",
                    "address": {
                        "city": "San Francisco",
                        "country": "US",
                        "state": "CA",
                        "street1": "50 Beale Street",
                        "street2": "7th floor",
                        "zipcode": "94105",
                        "location_name": "Narvar Inc."
                    }
                },
                "amount": "122.57",
                "tax_rate": "1.05",
                "tax_amount": "13.01",
                "payments": [
                    {
                        "method": "Card",
                        "payment_card": "8172",
                        "merchant": "VISA",
                        "gift_card": "false"
                    }
                ]
            },
            "shipments": [
                {
                    "tracking_number": "1ZY275X79034563906",
                    "tracking_url": "https://www.narvar.com/nordstrom/tracking/ups?tracking_numbers=1ZY275X79034563906&amp;order_number=20190110T8VNQ9K",
                    "items": [
                        {
                            "product_sku": "6073667060-1",
                            "quantity": "12"
                        }
                    ],
                    "ship_to": {
                        "first_name": "James",
                        "last_name": "Johnson",
                        "phone": "5555552368",
                        "phone_extension": "157",
                        "email": "noreply@narvar.com",
                        "fax": "5555552368",
                        "address": {
                            "city": "San Francisco",
                            "country": "US",
                            "state": "CA",
                            "street1": "50 Beale Street",
                            "street2": "7th floor",
                            "zipcode": "94105",
                            "location_name": "Narvar Inc."
                        }
                    },
                    "ship_date": "2018-12-24T04:10:16Z",
                    "carrier": "UPS"
                }
            ],
            "items": [
                {
                    "product_sku": "6073667060-1",
                    "name": "Narvar Hoodie",
                    "description": "Narvar Hoodie XXL Winter Purple Secret",
                    "price": "169.24",
                    "discount_amount": "4.37",
                    "discount_percent": "5.68",
                    "image_url": "https://cdn.shopify.com/s/files/1/0020/4049/6187/products/hoodie1.png?v=153203403",
                    "item_url": "http://itempageurl.com/bDtvnj",
                    "quantity": "2",
                    "custom_attributes": {
                        "style": "Purple Secret",
                        "color_id": "4mWGfb1m",
                        "color": "purple",
                        "size": "S"
                    }
                }
            ]
        },
        "customer": {
            "first_name": "James",
            "last_name": "Johnson",
            "phone": "5555552368",
            "phone_extension": "157",
            "email": "noreply@narvar.com",
            "fax": "5555552368",
            "address": {
                "city": "San Francisco",
                "country": "US",
                "state": "CA",
                "street1": "50 Beale Street",
                "street2": "7th floor",
                "zipcode": "94105",
                "location_name": "Narvar Inc."
            }
        },
        "published_date": "2018-12-25T08:15:55.106Z"
    }

    beforeAll(() => {
        fetchShipmentsByTrackingNumber.mockReturnValueOnce(mockShipments)
        fetchShipments.mockReturnValueOnce(mockShipments)
    })

    afterEach(() => {
        fetchShipmentsByTrackingNumber.mockClear()
    })

    it('should process notification correctly', async () => {
        await processWebhookData(mockNotification)

        expect(fetchShipmentsByTrackingNumber).toHaveBeenCalled()
        expect(fetchShipments).toHaveBeenCalled()
        expect(updateShipment).toHaveBeenCalled()
        expect(updateOrder).toHaveBeenCalled()
    })

    it('should ignore notification', async () => {
        
        await processWebhookData(mockNonProccesableNotification)
        expect(fetchShipmentsByTrackingNumber).toBeCalledTimes(0)
    })
})