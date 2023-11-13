export interface WebhookNotification {
    version: string;
    narvar_tracer_id: string;
    notification_type: string;
    notification_triggered_by_tracking_number: string;
    notification_locale?: string;
    notification_date?: string;
    order?: {
        order_number?: string;
        placement_date?: string;
        billing_document?: {
            billed_to?: {
                first_name?: string;
                last_name?: string;
                phone?: string;
                phone_extension?: string;
                email?: string;
                fax?: string;
                address?: {
                    city?: string;
                    country?: string;
                    state?: string;
                    street1?: string;
                    street2?: string;
                    zipcode?: string;
                    location_name?: string;
                };
            };
            amount?: string;
            tax_rate?: string;
            tax_amount?: string;
            payments?: {
                method?: string;
                payment_card?: string;
                merchant?: string;
                gift_card?: string;
            }[];
        };
        shipments?: {
            tracking_number?: string;
            tracking_url?: string;
            items: {
                product_sku?: string;
                quantity?: string;
            }[];
            ship_to?: {
                first_name?: string;
                last_name?: string;
                phone?: string;
                phone_extension?: string;
                email?: string;
                fax?: string;
                address?: {
                    city?: string;
                    country?: string;
                    state?: string;
                    street1?: string;
                    street2?: string;
                    zipcode?: string;
                    location_name?: string;
                };
            };
            ship_date?: string;
            carrier?: string;
        }[];
        items?: {
            product_sku?: string;
            name?: string;
            description?: string;
            price?: string;
            discount_amount?: string;
            discount_percent?: string;
            image_url?: string;
            item_url?: string;
            quantity?: string;
            custom_attributes?: {
                style?: string;
                color_id?: string;
                color?: string;
                size?: string;
            };
        }[];
    };
    customer?: {
        first_name?: string;
        last_name?: string;
        phone?: string;
        phone_extension?: string;
        email?: string;
        fax?: string;
        address?: {
            city?: string;
            country?: string;
            state?: string;
            street1?: string;
            street2?: string;
            zipcode?: string;
            location_name?: string;
        };
    };
    published_date: string;
}