const { formatEmailApiRequestBodyFromOrder } = require('./email');

const { COMPLETE_ORDER_ENGLISH_UNTYPED } = require('./__mocks__/constants');

/** @type {import('../orders').Order} */
// @ts-ignore re-assigning to get around excess property checks
const completeOrderEnglish = COMPLETE_ORDER_ENGLISH_UNTYPED;

describe('formatEmailApiRequestBodyFromOrder', () => {
  it('returns a correctly formmated object when given a vaild order', () => {
    expect(formatEmailApiRequestBodyFromOrder(completeOrderEnglish)).toEqual({
      request: {
        Channel: 'Email',
        OwnerId: 'F6UJ9A000002',
        Recipient: '{"address":"example01@example.com","locale":"en-CA"}',
        Sender: '',
        Subject: '{"Name":"Salesorder","Id":"122004"}',
        Topic: 'Confirmation',
        Data: expect.any(String)
      }
    });
  });

  it('returns a correctly formmated object when given a vaild BOPIS order', () => {
    const completeOrderEnglishBOPIS = { ...completeOrderEnglish, custom: { ...completeOrderEnglish.custom, fields: { ...completeOrderEnglish.custom.fields, isStorePickup: true } } };
    expect(formatEmailApiRequestBodyFromOrder(completeOrderEnglishBOPIS)).toEqual({
      request: {
        Channel: 'Email',
        OwnerId: 'F6UJ9A000002',
        Recipient: '{"address":"example01@example.com","locale":"en-CA"}',
        Sender: '',
        Subject: '{"Name":"Salesorder","Id":"122004"}',
        Topic: 'ConfirmationBOPIS',
        Data: expect.any(String)
      }
    });
  });

});
