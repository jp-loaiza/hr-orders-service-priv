import tracer from 'dd-trace'
import fs from 'fs'

tracer.init({
    runtimeMetrics: true,
    version: fs.readFileSync('version.txt', 'utf8').toString().trim()
})

tracer.use('express', {
    service: 'hr-orders-service',
    headers: ['User-Agent']
})

export default tracer