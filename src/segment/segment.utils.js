//Segment Variables
const Analytics = require('analytics-node')
const writeKey = process.env.SEGMENT_WRITE_KEY ? process.env.SEGMENT_WRITE_KEY : 'writeKey'
const analytics = new Analytics(writeKey)

/**
 * @param {string} eventName
 * @param {string} userId
 * @param {object} properties
 */

const sendSegmentTrackCall = (eventName, userId, anonymousId, properties) => {
  const segmentObject = {
    event: eventName,
    userId: userId,
    anonymousId: anonymousId,
    properties: {...properties}
  }
  analytics.track(segmentObject)
}

/**
 * @param {string} userId
 * @param {object} properties
 */

const sendSegmentIdentifyCall = (userId, anonymousId, properties) => {
  analytics.identify({
    userId: userId ? userId : undefined,
    anonymousId: anonymousId ? anonymousId : undefined,
    traits: {
      ...properties
    }
  })
}

module.exports = {
  sendSegmentTrackCall,
  sendSegmentIdentifyCall
}