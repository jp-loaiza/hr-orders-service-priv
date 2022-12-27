// For usage details https://github.com/brightcove/hot-shots#usage
import StatsD from 'hot-shots'
import { STATS_UDS_PROTOCOL_ENABLED } from './config'

const statsClient = new StatsD({
  protocol: STATS_UDS_PROTOCOL_ENABLED ? 'uds' : 'udp'
});

export default statsClient
