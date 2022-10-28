//Segment Variables
const Analytics = require('analytics-node')
const writeKey = process.env.SEGMENT_WRITE_KEY ? process.env.SEGMENT_WRITE_KEY : 'writeKey'
const analytics = new Analytics(writeKey)

/**
 * @param {string} eventName
 * @param {string} userId
 * @param {object} properties
 */

const sendSegmentTrackCall = (eventName, userId, properties) => {
  const segmentObject = {
    userId: userId,
    event: eventName,
    properties: properties
  }
  analytics.track(segmentObject)
}

/**
 * @param {string} userId
 * @param {object} properties
 */

const sendSegmentIdentifyCall = (userId, properties) => {
  analytics.identify({
    userId: userId,
    traits: {
      ...properties
    }
  })
}

module.exports = {
  sendSegmentTrackCall,
  sendSegmentIdentifyCall
}