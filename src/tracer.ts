import { Order } from '@commercetools/platform-sdk'
import tracer from 'dd-trace'
import fs from 'fs'

tracer.init({
  runtimeMetrics: true,
  logInjection: true,
  version: fs.readFileSync('version.txt', 'utf8').toString().trim()
})

tracer.use('winston')

tracer.use('express', {
  service: 'hr-orders-service',
  headers: ['User-Agent']
})

export const spanSetError = (e: any) => {
  const span = tracer.scope().active()
  span?.setTag('error', e)
}

export const hydrateOrderSpanTags = (order: Order, extra_tags?: {}) => {
  const span = tracer.scope().active()
  span?.addTags({
    ...extra_tags,
    order_id: order.id,
    order_customer_id: order.customerId,
    order_number: order.orderNumber,
  })
}

export default tracer