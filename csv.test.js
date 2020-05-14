const { generateCsvStringFromOrder } = require('./csv')

const completeOrderEnglish =  /** @type {import('./orders').Order} */ ({
  type: 'Order',
  id: 'fcfa2770-8afd-41fc-87cf-50293a2fcd9b',
  version: 7,
  lastMessageSequenceNumber: 4,
  createdAt: '2020-05-05T20:54:07.503Z',
  lastModifiedAt: '2020-05-05T21:24:36.112Z',
  lastModifiedBy: {
    clientId: 'V8OBU194rSz516W2-CrwV5QL',
    isPlatformClient: false,
  },
  createdBy: {
    clientId: 'Qj2NyrWdIX1y5pFKeySN3q5x',
    isPlatformClient: false,
  },
  orderNumber: '67899',
  customerId: '48be3e25-9cc0-4c8c-9fa1-35d0bf6c2aa7',
  customerEmail: 'test@example.com',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'CAD',
    centAmount: 7118,
    fractionDigits: 2,
  },
  orderState: 'Open',
  syncInfo: [],
  returnInfo: [],
  shippingInfo: {
    shippingMethodName: 'FedEx Express',
    price: {
      type: 'centPrecision',
      currencyCode: 'CAD',
      centAmount: 565,
      fractionDigits: 2,
    },
    shippingRate: {
      price: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 500,
        fractionDigits: 2,
      },
      tiers: [],
    },
    taxRate: {
      name: 'HST-ON',
      amount: 65.0,
      includedInPrice: true,
      country: 'CA',
      subRates: [],
    },
    deliveries: [],
    taxedPrice: {
      totalNet: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 9,
        fractionDigits: 2,
      },
      totalGross: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 565,
        fractionDigits: 2,
      },
    },
    shippingMethodState: 'MatchesCart',
  },
  taxMode: 'External',
  inventoryMode: 'None',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  origin: 'Customer',
  lineItems: [
    {
      id: '63ac6446-aa81-4aa5-8527-255ac00dc74a',
      productId: 'e445798e-d0ab-4a83-9e91-f0632bf8af41',
      name: {
        'fr-CA': 'Printed Silk Tie',
        'en-CA': 'Printed Silk Tie',
      },
      productType: {
        typeId: 'product-type',
        id: '3f69b1dd-631c-4913-b015-c20c083a7940',
      },
      productSlug: {
        'en-CA': '2002511081',
        'fr-CA': '2002511081',
      },
      variant: {
        id: 2,
        sku: '-2294027',
        prices: [
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 5799,
              fractionDigits: 2,
            },
            id: '6b8db701-1ca5-4ab4-b9fd-d0ad0914394f',
          },
        ],
        images: [],
        attributes: [
          {
            name: 'brandName',
            value: {
              'en-CA': 'Eton',
              'fr-CA': 'Eton',
            },
          },
          {
            name: 'construction',
            value: {
              'en-CA': '<li> Made in England</li>',
              'fr-CA': '<li> Confectionnée en Angleterre',
            },
          },
          {
            name: 'fabricAndMaterials',
            value: {
              'en-CA': '<li> 100% silk\n<li> Neat print \n<li> Multi-colour',
              'fr-CA': '<li> 100 % soie\n<li> Fins motifs\n<li> Multicolore',
            },
          },
          {
            name: 'styleAndMeasurements',
            value: {
              'en-CA': '<li> Width: 8 cm',
              'fr-CA': '<li> Largeur : 8 cm',
            },
          },
          {
            name: 'careInstructions',
            value: {
              'en-CA': '<li> Dry clean only',
              'fr-CA': '<li> Nettoyer à sec seulement',
            },
          },
          {
            name: 'advice',
            value: {
              'en-CA': '',
              'fr-CA': '',
            },
          },
          {
            name: 'webStatus',
            value: true,
          },
          {
            name: 'season',
            value: 'SP-18',
          },
          {
            name: 'originalPrice',
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 14500,
              fractionDigits: 2,
            },
          },
          {
            name: 'vsn',
            value: 'A000 30247 80',
          },
          {
            name: 'relatedProductId',
            value: 'A000 30247 80274727Eton',
          },
          {
            name: 'colorId',
            value: '081',
          },
          {
            name: 'skuLastModifiedInternal',
            value: '2018-01-05T17:01:52.000Z',
          },
          {
            name: 'size',
            value: {
              'en-CA': 'O/S',
            },
          },
          {
            name: 'sizeId',
            value: '179',
          },
          {
            name: 'onlineSalePrice',
            value: {
              fractionDigits: 2,
              centAmount: 5799,
              currencyCode: 'CAD',
              type: 'centPrecision',
            },
          },
          {
            name: 'isOnlineSale',
            value: true,
          },
          {
            name: 'onlineDiscount',
            value: 60,
          },
          {
            name: 'isOutlet',
            value: false,
          },
          {
            name: 'styleOutletLastModifiedInternal',
            value: '2019-08-02T16:37:00.000Z',
          },
        ],
        assets: [],
      },
      price: {
        value: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 5799,
          fractionDigits: 2,
        },
        id: '18fe7002-7934-4a90-8c74-7f8791916430',
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      taxRate: {
        name: 'HST-ON',
        amount: 0.13,
        includedInPrice: false,
        country: 'CA',
        subRates: [],
      },
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: 'a5b4470b-6518-4a10-88c7-3773b4c07971',
          },
        },
      ],
      priceMode: 'Platform',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 5799,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 5799,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 6553,
          fractionDigits: 2,
        },
      },
      custom: {
        type: {
          typeId: 'type',
          id: '72953947-9bf8-4d31-8a2e-9a9c22d40649',
        },
        fields: {
          isGift: true,
          barcodeData: [
            {
              typeId: 'key-value-document',
              id: '1f55cd86-0a2c-4240-9031-9b8393537c62',
              obj: {
                id: '1f55cd86-0a2c-4240-9031-9b8393537c62',
                version: 1,
                container: 'barcodes',
                key: 'aleksBarcodeTest-009',
                value: {
                  id: 'aleksBarcodeTest-009',
                  styleId: '22222222',
                  skuId: '-aleksTest12',
                  subType: 'UPCE',
                  barcode: 'aleksBarcodeTest-009',
                  lastModifiedDate: 1459699217000,
                },
                createdAt: '2020-04-01T19:03:08.808Z',
                lastModifiedAt: '2020-04-01T19:03:08.808Z',
                lastModifiedBy: {
                  clientId: '9YnDCNDg16EER7mWlMjXeHkF',
                  isPlatformClient: false,
                },
                createdBy: {
                  clientId: '9YnDCNDg16EER7mWlMjXeHkF',
                  isPlatformClient: false,
                },
              },
            },
          ],
          orderDetailLastModifiedDate: '2018-12-28T15:23:49.008Z',
        },
      },
      lineItemMode: 'Standard',
    },
    {
      id: 'd64aad3b-c0af-45e1-9b35-c800d50d75be',
      productId: 'c167482d-9561-4567-8790-c49372575249',
      name: {
        'fr-CA': 'Printed Silk Tie',
        'en-CA': 'Printed Silk Tie',
      },
      productType: {
        typeId: 'product-type',
        id: '3f69b1dd-631c-4913-b015-c20c083a7940',
      },
      productSlug: {
        'en-CA': '5327754781',
        'fr-CA': '5327754781',
      },
      variant: {
        id: 2,
        sku: '-649343',
        prices: [],
        images: [],
        attributes: [
          {
            name: 'colorId',
            value: '081',
          },
          {
            name: 'skuLastModifiedInternal',
            value: '2016-03-31T13:03:01.000Z',
          },
          {
            name: 'size',
            value: {
              'en-CA': 'NA',
            },
          },
          {
            name: 'sizeId',
            value: '177',
          },
          {
            name: 'isOutlet',
            value: true,
          },
          {
            name: 'styleOutletLastModifiedInternal',
            value: '2019-08-20T02:20:55.000Z',
          },
        ],
        assets: [],
      },
      price: {
        value: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 5799,
          fractionDigits: 2,
        },
        id: '464e9664-8b65-4d99-99db-e7062f28e9ed',
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      taxRate: {
        name: 'HST-ON',
        amount: 0.13,
        includedInPrice: false,
        country: 'CA',
        subRates: [],
      },
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '207a16ee-a405-4347-b2fd-37fcc589b250',
          },
        },
      ],
      priceMode: 'Platform',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 5799,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 5799,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 6553,
          fractionDigits: 2,
        },
      },
      custom: {
        type: {
          typeId: 'type',
          id: '72953947-9bf8-4d31-8a2e-9a9c22d40649',
        },
        fields: {
          orderDetailLastModifiedDate: '2018-12-28T15:23:49.007Z',
          isGift: true,
          barcodeData: [
            {
              typeId: 'key-value-document',
              id: '396d3d6e-b799-43b0-b5a2-563e986d24a0',
              obj: {
                id: '396d3d6e-b799-43b0-b5a2-563e986d24a0',
                version: 1,
                container: 'barcodes',
                key: '38211393-102',
                value: {
                  id: '38211393-102',
                  styleId: '001',
                  skuId: '003',
                  subType: 'UPCE',
                  barcode: '38211393-102',
                  lastModifiedDate: 1459699217000,
                },
                createdAt: '2020-03-26T15:45:27.667Z',
                lastModifiedAt: '2020-03-26T15:45:27.667Z',
                lastModifiedBy: {
                  clientId: '9YnDCNDg16EER7mWlMjXeHkF',
                  isPlatformClient: false,
                },
                createdBy: {
                  clientId: '9YnDCNDg16EER7mWlMjXeHkF',
                  isPlatformClient: false,
                },
              },
            },
          ],
        },
      },
      lineItemMode: 'Standard',
    },
  ],
  customLineItems: [],
  transactionFee: false,
  discountCodes: [],
  shippingAddress: {
    firstName: 'Harry',
    lastName: 'Rosen',
    additionalStreetInfo: '82 Bloor St W',
    postalCode: 'M5S1L9',
    city: 'Toronto',
    state: 'ON',
    country: 'CA',
    phone: '(416) 972-0556',
  },
  billingAddress: {
    firstName: 'Harry',
    lastName: 'Rosen',
    additionalStreetInfo: '82 Bloor St W',
    postalCode: 'M5S1L9',
    city: 'Toronto',
    state: 'ON',
    country: 'CA',
    phone: '(416) 972-0556',
  },
  itemShippingAddresses: [],
  refusedGifts: [],
  paymentInfo: {
    payments: [
      {
        obj: {
          paymentMethodInfo: {
            method: '06',
          },
          amountPlanned: {
            centAmount: 152,
          }
        }
      }
    ]
  },
  locale: 'en-CA',
  paymentState: 'Paid'
})

describe('generateCsvStringFromOrder', () => {
  it('returns the correct CSV string when given a complete order whose locale is en-CA', () => {
    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
H,990,67899,Harry,Rosen,,82 Bloor St W,,,Toronto,ON,M5S1L9,CA,48be3e25-9cc0-4c8c-9fa1-35d0bf6c2aa7,Harry,Rosen,82 Bloor St W,,,Toronto,ON,M5S1L9,CA,(416) 972-0556,test@example.com,FDX,Y,N,,5.65,15.08,,71.18,,,,,,,2020-05-05 20:54,,0,HST-ON,,,,,,990,,,EXPRESS,1,,,Y
D,990,1,67899,,,,1,57.99,,57.99,0,7.54,65.53,aleksBarcodeTest-009,N,63ac6446-aa81-4aa5-8527-255ac00dc74a,Y,,,,,UPCE
D,990,2,67899,,,,1,57.99,,57.99,0,7.54,65.53,38211393-102,N,d64aad3b-c0af-45e1-9b35-c800d50d75be,Y,,,,,UPCE
T,1,1,67899,,7.54,HST-ON
T,1,2,67899,,7.54,HST-ON
N,990,1,67899,1.52,06,,,,,
`.split('\n').join('\r\n') // the expected string has Windows line breaks
    expect(generateCsvStringFromOrder(completeOrderEnglish)).toEqual(expectedOrderCsv)
  })

  it('returns the correct CSV string when given a complete order whose locale is fr-CA', () => {
    const completeOrderFrench = /** @type {import('./orders').Order} */ ({
      ...completeOrderEnglish,
      locale: 'fr-CA'
    })
    
    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
H,990,67899,Harry,Rosen,,82 Bloor St W,,,Toronto,ON,M5S1L9,CA,48be3e25-9cc0-4c8c-9fa1-35d0bf6c2aa7,Harry,Rosen,82 Bloor St W,,,Toronto,ON,M5S1L9,CA,(416) 972-0556,test@example.com,FDX,Y,N,,5.65,15.08,,71.18,,,,,,,2020-05-05 20:54,,0,HST-ON,,,,,,990,,,EXPRESS,3,,,Y
D,990,1,67899,,,,1,57.99,,57.99,0,7.54,65.53,aleksBarcodeTest-009,N,63ac6446-aa81-4aa5-8527-255ac00dc74a,Y,,,,,UPCE
D,990,2,67899,,,,1,57.99,,57.99,0,7.54,65.53,38211393-102,N,d64aad3b-c0af-45e1-9b35-c800d50d75be,Y,,,,,UPCE
T,1,1,67899,,7.54,HST-ON
T,1,2,67899,,7.54,HST-ON
N,990,1,67899,1.52,06,,,,,
`.split('\n').join('\r\n')
    expect(generateCsvStringFromOrder(completeOrderFrench)).toEqual(expectedOrderCsv)
  })

  it('returns the correct CSV string when given an order whose payment state is \'Failed\'', () => {
    const orderWithFailedPayment = {
      ...completeOrderEnglish,
      paymentState: 'Failed'
    }

    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
H,990,67899,Harry,Rosen,,82 Bloor St W,,,Toronto,ON,M5S1L9,CA,48be3e25-9cc0-4c8c-9fa1-35d0bf6c2aa7,Harry,Rosen,82 Bloor St W,,,Toronto,ON,M5S1L9,CA,(416) 972-0556,test@example.com,FDX,Y,N,,5.65,15.08,,71.18,,,,,,,2020-05-05 20:54,,0,HST-ON,,,,,,990,,,EXPRESS,1,,,N
D,990,1,67899,,,,1,57.99,,57.99,0,7.54,65.53,aleksBarcodeTest-009,N,63ac6446-aa81-4aa5-8527-255ac00dc74a,Y,,,,,UPCE
D,990,2,67899,,,,1,57.99,,57.99,0,7.54,65.53,38211393-102,N,d64aad3b-c0af-45e1-9b35-c800d50d75be,Y,,,,,UPCE
T,1,1,67899,,7.54,HST-ON
T,1,2,67899,,7.54,HST-ON
N,990,1,67899,1.52,06,,,,,
`.split('\n').join('\r\n')

    expect(generateCsvStringFromOrder(orderWithFailedPayment)).toEqual(expectedOrderCsv)
  })

  // Placeholders
  xit('returns the correct CSV string when given an order that has only one line item of one quantity', () => {})
  xit('returns the correct CSV string when given an order that has only one line item of a quantity greater than one', () => {})
  xit('returns the correct CSV string when given an order that has a gift', () => {})
})
