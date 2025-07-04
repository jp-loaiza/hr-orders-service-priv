//const commercetools = require('../commercetools/__mocks__/commercetools')
import { convertPickups, getItemUrl } from './narvar'

const BASE_ORDER = require('../example-orders/24845933.json')

const getShipment = (/** @type {string} */ createdAtDate: string, /** @type {string} */ lastModifedDate: string) =>  {
  return [{
    id: 'string',
    createdAt: createdAtDate,
    value: {
      fillSiteId: 'string',
      destinationSiteId: 'string',
      shipmentId: 'string',
      shipmentLastModifiedDate: lastModifedDate,
      fromZipCode: 'string',
      fromAddress1: 'string',
      fromAddress2: 'string',
      fromCity: 'string',
      fromCountryId: 'string',
      fromHomePhone: 'string',
      fromStateId: 'string',
      fromStoreName: 'string',
      trackingNumber: 'string',
      shipmentItemLastModifiedDate: lastModifedDate,
      shipmentDetails: [{
        siteId: 'string',
        line: 123,
        businessUnitId: 'string',
        status: 'PICKUP',
        quantityShipped: 1234,
        lineItemId: 'string',
        shipmentDetailId: 'string',
        carrierId: 'string',
        trackingNumber: 'string',
        serviceType: 'string',
        shippedDate: 'string'
      }]
    }
  }]
}

describe('convertPickups', () => {
  it('uses last modifed date for converted pickups', () => {
    const lastModifedDate = new Date(new Date().valueOf()).toJSON()

    const createdAtDate = '2022-06-07T20:27:02.045Z'

    const result = convertPickups(BASE_ORDER, getShipment(createdAtDate, lastModifedDate))
    expect(result[0].status.date).toEqual(lastModifedDate)  
  })

  it('uses createdAt Date for converted pickups when lastModifiedDate is not provided', () => {
    const createdAtDate = '2022-06-07T20:27:02.045Z'

    const result = convertPickups(BASE_ORDER, getShipment(createdAtDate, ''))
    expect(result[0].status.date).toEqual(createdAtDate)  
  })
})

describe('test getItemUrl', () => {
  it('should get itemUrl when all params are passed', () => {
    const locale = 'en-CA'
    const productSlug = 'slug'


    const result = getItemUrl(productSlug,locale, '')
    expect(result).toEqual('https://harryrosen.com/en/product/slug')  
  })

  it('should get itemUrl for shopfinalcut when all params are passed', () => {
    const locale = 'en-CA'
    const productSlug = 'slug'


    const result = getItemUrl(productSlug,locale, '00997')
    expect(result).toEqual('https://www.shopfinalcut.com/en/product/slug')
  })

  it('should return undefined when locale is missing', () => {
    const locale = ''
    const productSlug = 'slug'

    const result = getItemUrl(productSlug,locale,'')
    expect(result).toEqual(undefined)  
  })
})