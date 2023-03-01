import KafkaClient from '../kafkaClient'
import OrderProcessingConsumer from '../OrderProcessingConsumer';
import {
    orderMessageDisperse
} from '../../jobs/jobs.utils'
import { OrderProcessMessage } from '../Types';

jest.mock('../kafkaClient')
jest.mock('../../jobs/jobs.utils')

const testLogger = {
    info: (_msg: string) => { },
    error: (_msg: unknown) => { },
}

function mockOrderMessage() {
    const orderMessage: OrderProcessMessage = {
        MESSAGE_KEY: 'string',
        LASTMODIFIEDDATE: 123654,
        createdAt: Date.now().toString(),
        resource: {
            typeId: 'order',
            id: "be1d42ab-377d-4b33-bd7f-fcb7d2401072",
        },
        //OrderStateTransition interface contains types we do not need but have to fulfill..
        id: "be1d42ab-377d-4b33-bd7f-fcb7d2401072",
        //@ts-ignore
        type: 'OrderStateTransition',
        lastModifiedAt: Date.now().toString(),
        version: 1234,
        sequenceNumber: 1234,
        force: true,
        resourceVersion: 1234,
        state: {
            "typeId": "state",
            "id": "fc46cc05-565c-478f-bcf0-a70cf73c8caf"
        },
    }
    return orderMessage
}

describe('OrderProcessingConsumerEvent', () => {

    it('should call order message disburse', async () => {
        const mockMessage = mockOrderMessage()
        const orderProcessingConsumer = new OrderProcessingConsumer(KafkaClient, testLogger)
        orderProcessingConsumer.onMessage(mockMessage)
        expect(orderMessageDisperse).toHaveBeenCalled()
    })
})
