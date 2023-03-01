// @ts-nocheck The linter gets confused by Jest mocks

import {
  generateFilenameFromOrder,
  createAndUploadCsvs,
  sendOrderUpdates,
  transformToOrderPayment,
  sendOrdersToNarvar,
  checkJobsHealth,
  orderMessageDisperse
} from './jobs.utils'
import { setOrderAsSentToOms, setOrderErrorFields, setOrderCustomFields } from '../commercetools/commercetools'
import { sendToNarvar } from '../narvar/narvar'
import { pluginPayment, mockOrder } from './mock_orders'
import { validOrder, invalidOrder } from '../commercetools/__mocks__/commercetools'
import { Response } from 'express'
import { SENT_TO_OMS_STATUSES } from '../constants'

jest.mock('../config')
jest.mock('../commercetools/commercetools')
jest.mock('../request.utils')
jest.mock('../jesta/jesta')
jest.mock('../narvar/narvar')

describe('generateFilenameFromOrder', () => {
  const mockOrder1 = {
    createdAt: '2020-05-05T20:54:07.503Z',
    orderNumber: '12345'
  }

  const mockOrder2 = {
    createdAt: '2020-01-01T01:04:17.503Z',
    orderNumber: '00001'
  }

  it('returns the correct filename', () => {
    expect(generateFilenameFromOrder(mockOrder1)).toBe('Orders-2020-05-05-20540712345.csv')
    expect(generateFilenameFromOrder(mockOrder2)).toBe('Orders-2020-01-01-01041700001.csv')
  })
})

describe('createAndUploadCsvs', () => {
  afterEach(() => {
    setOrderErrorFields.mockClear()
    setOrderAsSentToOms.mockClear()
  })

  // Each time `createAndUploadCsvs` is called called, different mock orders
  // get fed into it, as indicated in the test description. See `/__mocks__/commercetools.js`
  // for details.
  it('processes [validOrder, invalidOrder] correctly', async () => {
    await createAndUploadCsvs()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorFields.mock.calls.length).toBe(1)
  })

  it('processes [invalidOrder, validOrder] correctly', async () => {
    await createAndUploadCsvs()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorFields.mock.calls.length).toBe(1)
  })

  it('processes [validOrder] correctly', async () => {
    await createAndUploadCsvs()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorFields.mock.calls.length).toBe(0)
  })

  it('processes [] correctly', async () => {
    await createAndUploadCsvs()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(0)
    expect(setOrderErrorFields.mock.calls.length).toBe(0)
  })
})

describe('sendOrderUpdates', () => {
  afterEach(() => {
    setOrderErrorFields.mockClear()
    setOrderAsSentToOms.mockClear()
  })

  // Each time 'sendOrderUpdates' is called called, different mock orders
  // get fed into it, as indicated in the test description. See `/__mocks__/commercetools.js`
  // for details.
  it('processes [validOrder, invalidOrder] correctly', async () => {
    await sendOrderUpdates()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorFields.mock.calls.length).toBe(1)
  })

  it('processes [invalidOrder, validOrder] correctly', async () => {
    await sendOrderUpdates()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorFields.mock.calls.length).toBe(1)
  })

  it('processes [validOrder] correctly', async () => {
    await sendOrderUpdates([])
    expect(setOrderAsSentToOms.mock.calls.length).toBe(1)
    expect(setOrderErrorFields.mock.calls.length).toBe(0)
  })

  it('processes [] correctly', async () => {
    await sendOrderUpdates()
    expect(setOrderAsSentToOms.mock.calls.length).toBe(0)
    expect(setOrderErrorFields.mock.calls.length).toBe(0)
  })
})

describe('transformToOrderPayment', () => {
  const mockTransaction = {
    type: 'Authorization',
    state: 'Success'
  }
  const mockPayment = {
    obj: {
      paymentMethodInfo: {
        method: 'credit'
      },
      paymentStatus: {
        interfaceCode: 'preauthed'
      },
      transactions: []
    }
  }
  const mockOrder = {
    orderNumber: '12345',
    paymentInfo: {
      payments: []
    }
  }

  const mockOrderNoPayment = {
    orderNumber: '12345',
    paymentState: 'PAID',
    totalPrice: {
      type: 'centPrecision',
      currencyCode: 'CAD',
      centAmount: 0,
      fractionDigits: 2
    }
  }

  it('invalid order update; no credit card payment', () => {
    const mockOrderNoCredit = { ...mockOrder, paymentInfo: { payments: [{ ...mockPayment, obj: { ...mockPayment.obj, paymentMethodInfo: { method: 'notCredit' } } }] } }
    expect(transformToOrderPayment(mockOrderNoCredit)).toEqual({
      errorMessage: 'No credit card payment with payment release change',
      orderNumber: mockOrderNoCredit.orderNumber
    })
  })
  it('invalid order update; no valid interface code', () => {
    const mockOrderInvalidInterfaceCode = { ...mockOrder, paymentInfo: { payments: [{ ...mockPayment, obj: { ...mockPayment.obj, paymentStatus: { interfaceCode: 'failed' } } }] } }
    expect(transformToOrderPayment(mockOrderInvalidInterfaceCode)).toEqual({
      errorMessage: 'Order update is not for a status that jesta recognizes: failed',
      orderNumber: mockOrderInvalidInterfaceCode.orderNumber
    })
  })
  it('invalid order update; invalid transaction status', () => {
    const mockOrderInvalidStatus = { ...mockOrder, paymentInfo: { payments: [{ ...mockPayment, obj: { ...mockPayment.obj, transactions: [{ ...mockTransaction, state: 'Failure' }] } }] } }
    expect(transformToOrderPayment(mockOrderInvalidStatus)).toEqual({
      errorMessage: 'Order update is not for a status that jesta recognizes: preauthed',
      orderNumber: mockOrderInvalidStatus.orderNumber
    })
  })

  it('valid discounted order update: no payment should transform', () => {
    expect(transformToOrderPayment(mockOrderNoPayment)).toEqual({
      orderNumber: mockOrderNoPayment.orderNumber,
      status: 'Success'
    })
  })

  /**TODO: We should look into other payments apart from credit, like paypal and 'plugin'- (whatever that means)
          The mock_orders contains examples of payments that commented test below will use..**/
  xit('valid pluginPayment order update: should transform', () => {
    expect(transformToOrderPayment(pluginPayment)).toEqual({
      orderNumber: pluginPayment.orderNumber,
      status: 'Success'
    })
  })

  it('valid order update; cancel order delayed capture ON', () => {
    const mockOrderCancelDelayedCaptureOn = { ...mockOrder, paymentInfo: { payments: [{ ...mockPayment, obj: { ...mockPayment.obj, paymentStatus: { interfaceCode: 'cancelled' }, transactions: [{ ...mockTransaction, state: 'Failure' }] } }] } }
    expect(transformToOrderPayment(mockOrderCancelDelayedCaptureOn)).toEqual({
      orderNumber: mockOrderCancelDelayedCaptureOn.orderNumber,
      status: 'Failure'
    })
  })
  it('valid order update; cancel order delayed capture OFF', () => {
    const mockOrderCancelDelayedCaptureOff = { ...mockOrder, paymentInfo: { payments: [{ ...mockPayment, obj: { ...mockPayment.obj, paymentStatus: { interfaceCode: 'cancelled' }, transactions: [{ ...mockTransaction, type: 'Charge', state: 'Failure' }] } }] } }
    expect(transformToOrderPayment(mockOrderCancelDelayedCaptureOff)).toEqual({
      orderNumber: mockOrderCancelDelayedCaptureOff.orderNumber,
      status: 'Failure'
    })
  })
  it('valid order update; release order delayed capture ON', () => {
    const mockOrderReleaseDelayedCaptureOn = { ...mockOrder, paymentInfo: { payments: [{ ...mockPayment, obj: { ...mockPayment.obj, transactions: [{ ...mockTransaction }] } }] } }
    expect(transformToOrderPayment(mockOrderReleaseDelayedCaptureOn)).toEqual({
      orderNumber: mockOrderReleaseDelayedCaptureOn.orderNumber,
      status: 'Success'
    })
  })
  it('valid order update; release order delayed capture OFF', () => {
    const mockOrderReleaseDelayedCaptureOff = { ...mockOrder, paymentInfo: { payments: [{ ...mockPayment, obj: { ...mockPayment.obj, paymentStatus: { interfaceCode: 'paid' }, transactions: [{ ...mockTransaction, type: 'Charge' }] } }] } }
    expect(transformToOrderPayment(mockOrderReleaseDelayedCaptureOff)).toEqual({
      orderNumber: mockOrderReleaseDelayedCaptureOff.orderNumber,
      status: 'Success'
    })
  })
  it('valid order update; at least 1 transaction with release order delayed capture ON', () => {
    const mockOrderReleaseDelayedCaptureOn = { ...mockOrder, paymentInfo: { payments: [{ ...mockPayment, obj: { ...mockPayment.obj, transactions: [{ ...mockTransaction }, { ...mockTransaction, state: 'Failure' }] } }] } }
    expect(transformToOrderPayment(mockOrderReleaseDelayedCaptureOn)).toEqual({
      orderNumber: mockOrderReleaseDelayedCaptureOn.orderNumber,
      status: 'Success'
    })
  })
})

describe('sendOrdersToNarvar', () => {
  it('Sends NARVAR order successfully', async () => {
    await sendOrdersToNarvar()
    await Promise.resolve()

    expect(sendToNarvar).toHaveBeenCalled()
  })

  it('sets NARVAR success status fields in CT', async () => {
    await sendOrdersToNarvar()
    await Promise.resolve()

    expect(setOrderCustomFields).toHaveBeenCalled()
  })

})

describe('checkJobsHealth', () => {

  it('should return true if job is healthy', async () => {
    const response = {}
    const result = checkJobsHealth(response as Response)
    expect(result).toBeTruthy()
  })

  it('should return false if job is unhealthy', async () => {

  })
})
