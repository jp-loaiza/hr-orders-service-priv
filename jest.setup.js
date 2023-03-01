// https://stackoverflow.com/a/49591765/12484139
global.console = {
  ...global.console,
  log: jest.fn(), // console.log are ignored in tests
  error: jest.fn()
}

jest.useFakeTimers()

process.env.CJ_CID = 'CJ_CID'
process.env.CJ_SIGNATURE = 'CJ_SIGNATURE'
process.env.CJ_TYPE = 'CJ_TYPE'
process.env.CJ_CONVERSION_BASE_URL = 'https://www.emjcd.com/u'
process.env.SFTP_PRIVATE_KEY = 'SFTP_PRIVATE_KEY'
process.env.CREATE_UPLOAD_CSV_EVENT = true
process.env.ORDER_UPDATE_EVENT = true
process.env.EMAIL_NOTIFY_CRM_EVENT = true
process.env.ALGOLIA_CONVERSIONS_EVENT = true
process.env.PURCHASE_EVENTS_DY_EVENT = true
process.env.NARVAR_ORDER_EVENT = true
process.env.SEGMENT_ORDER_EVENT = true
process.env.ORDER_CONVERSION_TO_CJ_EVENT = true