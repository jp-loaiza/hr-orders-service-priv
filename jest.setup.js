// https://stackoverflow.com/a/49591765/12484139
global.console = {
  ...global.console,
  log: jest.fn(), // console.log are ignored in tests
  error: jest.fn()
}

process.env.CJ_CID = 'CJ_CID'
process.env.CJ_SIGNATURE = 'CJ_SIGNATURE'
process.env.CJ_TYPE = 'CJ_TYPE'
process.env.CJ_CONVERSION_BASE_URL = 'https://www.emjcd.com/u'