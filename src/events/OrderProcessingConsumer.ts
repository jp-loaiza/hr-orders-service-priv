import {
    ConsumerConfig,
    ConsumerRunConfig,
} from "kafkajs";
import {
    KAFKA_ORDER_PROCESS_CONSUMER_GROUP_ID,
    ORDER_PROCESS_MAX_BYTES_PER_PARTITION,
    ORDER_PROCESS_MAX_BYTES,
    ORDER_PROCESS_CONCURRENT_PARTITIONS,
    HR_COMMERCE_TOPIC
} from "../config";
import { orderMessageDisperse } from "../jobs/jobs.utils";
import { serializeError } from "../logger";
import BaseConsumer from "./BaseConsumer";
import { OrderProcessMessage } from "./Types";

export default class OrderProcessingConsumer extends BaseConsumer<OrderProcessMessage> {
    topic = HR_COMMERCE_TOPIC
    consumerGroupId = KAFKA_ORDER_PROCESS_CONSUMER_GROUP_ID

    protected consumerConfig: Partial<ConsumerConfig> = {
        maxBytesPerPartition: ORDER_PROCESS_MAX_BYTES_PER_PARTITION,
        maxBytes: ORDER_PROCESS_MAX_BYTES,
    };

    protected consumerRunConfig: ConsumerRunConfig = {
        partitionsConsumedConcurrently: ORDER_PROCESS_CONCURRENT_PARTITIONS,
        eachBatchAutoResolve: false,
    };

    async onMessage(message: OrderProcessMessage) {
        try {
            if (message.resource.typeId === 'order') {
                orderMessageDisperse(message)
            }
        } catch (err) {
            this.logger.error({
                type: 'order_consumer',
                error: serializeError(err),
                message: `error consuming order: ${message.id}}`,
            })
        }
    }
}