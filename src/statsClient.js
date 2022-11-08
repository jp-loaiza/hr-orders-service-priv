// For usage details https://github.com/brightcove/hot-shots#usage
const { StatsD } = require('hot-shots');
const { STATS_UDS_PROTOCOL_ENABLED } = require('./config');
const { logger } = require('../src/logger');

const statsClient = new StatsD({
  protocol: STATS_UDS_PROTOCOL_ENABLED ? 'uds' : 'udp',
  errorHandler: (error) => {
    logger.error({
      type: 'stats_client_error',
      error,
    });
  },
});

module.exports = { statsClient };
