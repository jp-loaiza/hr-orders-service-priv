const path = require('path')
const { readFileSync } = require('fs')
const { generateCsvStringFromOrder } = require('./csv')

const completeOrderEnglishUntyped = {
  type: 'Order',
  id: '6feea16b-a8b1-4d3e-a602-8be1a70d0e05',
  version: 5,
  lastMessageSequenceNumber: 1,
  createdAt: '2020-08-04T15:39:23.259Z',
  lastModifiedAt: '2020-08-04T15:39:39.299Z',
  lastModifiedBy: {
    clientId: 'kCdIHF2Ojlv7-yp1Dq2itE4O',
    isPlatformClient: false
  },
  createdBy: {
    clientId: 'k6QQpXCp89k8R8k7rwxem-h-',
    isPlatformClient: false
  },
  orderNumber: '23551711',
  customerId: '2daf22a9-a8b9-4651-830a-1d9a216aab9b',
  customerEmail: 'user@gmail.com',
  anonymousId: '11081e3e-bf99-44c3-beb0-8f5137b3910d',
  locale: 'en-CA',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'CAD',
    centAmount: 87800,
    fractionDigits: 2
  },
  taxedPrice: {
    totalNet: {
      type: 'centPrecision',
      currencyCode: 'CAD',
      centAmount: 87800,
      fractionDigits: 2
    },
    totalGross: {
      type: 'centPrecision',
      currencyCode: 'CAD',
      centAmount: 99214,
      fractionDigits: 2
    },
    taxPortions: [
      {
        rate: 0.13,
        amount: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 11414,
          fractionDigits: 2
        },
        name: 'HST'
      }
    ]
  },
  country: 'CA',
  orderState: 'Open',
  shipmentState: 'Pending',
  paymentState: 'Paid',
  syncInfo: [],
  returnInfo: [],
  shippingInfo: {
    shippingMethodName: 'FedEx Priority Overnight',
    price: {
      type: 'centPrecision',
      currencyCode: 'CAD',
      centAmount: 2800,
      fractionDigits: 2
    },
    shippingRate: {
      price: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 2800,
        fractionDigits: 2
      },
      tiers: []
    },
    taxRate: {
      name: '',
      amount: 0.13,
      includedInPrice: true,
      country: 'CA',
      subRates: [
        {
          name: 'HST',
          amount: 0.13
        }
      ]
    },
    deliveries: [],
    taxedPrice: {
      totalNet: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 2800,
        fractionDigits: 2
      },
      totalGross: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 3164,
        fractionDigits: 2
      }
    },
    shippingMethodState: 'MatchesCart'
  },
  taxMode: 'ExternalAmount',
  inventoryMode: 'None',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  origin: 'Customer',
  lineItems: [
    {
      id: '496332a3-45d9-4ed8-ae44-5b55693c89ce',
      productId: 'b238f925-d071-4ac5-a00b-e2b5c335c74e',
      name: {
        'fr-CA': 'Complet Huge6/Genius5',
        'en-CA': 'Huge6/Genius5 Suit '
      },
      productType: {
        typeId: 'product-type',
        id: '3f69b1dd-631c-4913-b015-c20c083a7940'
      },
      productSlug: {
        'en-CA': '20052807',
        'fr-CA': '20052807'
      },
      variant: {
        id: 20,
        sku: '-2998709',
        prices: [
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 85000,
              fractionDigits: 2
            },
            id: '1160c52f-c16d-4390-8018-e26b2f96e1ff',
            country: 'CA',
            custom: {
              type: {
                typeId: 'type',
                id: 'af9c14ac-6b56-48d4-b152-2b751d2c9c24'
              },
              fields: {
                priceType: 'originalPrice'
              }
            }
          }
        ],
        images: [
          {
            url: 'https://i1.adis.ws/i/harryrosen/20052807?$prp-4col-xl$',
            dimensions: {
              w: 242,
              h: 288
            }
          }
        ],
        attributes: [
          {
            name: 'brandName',
            value: {
              'en-CA': 'BOSS',
              'fr-CA': 'BOSS'
            }
          },
          {
            name: 'construction',
            value: {
              'en-CA':
                '<li> Huge6/Genius5\n<li> Single-breasted, Two-button, Two-piece Suit\n<li> Notch lapel\n<li> Fully lined\n<li> Double vent\n<li> Flat front pant with 1/4 top pockets and besom back pockets\n<li> Unfinished hems',
              'fr-CA':
                '<li> Modèle Huge6/Genius5\n<li> Complet deux-pièces (veston à deux boutons, simple boutonnage)\n<li> Revers cranté\n<li> Entièrement doublé\n<li> Fente double\n<li> Pantalon sans plis avec poches en biais et poches arrière passepoilées\n<li> Bords inférieurs non finis'
            }
          },
          {
            name: 'fabricAndMaterials',
            value: {
              'en-CA': '<li> 100% virgin wool\n<li> Midnight blue',
              'fr-CA': '<li> 100 % laine vierge\n<li> Bleu foncé'
            }
          },
          {
            name: 'styleAndMeasurements',
            value: {
              'en-CA':
                '<li> Slim fit\n<li> BOSS Huge6/Genius5 Slim fit\n<li> Back length: 29.5 in\n<li> Measurement is based on size 40R',
              'fr-CA':
                '<li> Coupe amincie\n<li> Coupe amincie Huge6/Genius5 de BOSS\n<li> Longueur du dos : 74,9 cm (29,5 po)\n<li> Mesure(s) prise(s) sur la taille 40R'
            }
          },
          {
            name: 'careInstructions',
            value: {
              'en-CA': '<li> Dry clean only',
              'fr-CA': '<li> Nettoyage à sec seulement'
            }
          },
          {
            name: 'advice',
            value: {
              'en-CA': '',
              'fr-CA': ''
            }
          },
          {
            name: 'webStatus',
            value: true
          },
          {
            name: 'season',
            value: 'FA-19'
          },
          {
            name: 'vsn',
            value: '50418716'
          },
          {
            name: 'relatedProductId',
            value: '50418716030305BOSS'
          },
          {
            name: 'styleLastModifiedInternal',
            value: '2020-07-28T01:10:33.000Z'
          },
          {
            name: 'isOutlet',
            value: false
          },
          {
            name: 'styleOutletLastModifiedInternal',
            value: '2020-07-27T14:05:00.000Z'
          },
          {
            name: 'colorId',
            value: '402'
          },
          {
            name: 'dimensionId',
            value: 'R'
          },
          {
            name: 'skuLastModifiedInternal',
            value: '2020-07-09T14:09:52.000Z'
          },
          {
            name: 'size',
            value: {
              'fr-CA': '40',
              'en-CA': '40'
            }
          },
          {
            name: 'sizeId',
            value: '110'
          },
          {
            name: 'colour',
            value: {
              'en-CA': 'Dark Blue',
              'fr-CA': 'Bleu marine'
            }
          },
          {
            name: 'colourGroup',
            value: {
              'en-CA': 'Blue',
              'fr-CA': 'Bleu'
            }
          },
          {
            name: 'sizeChart',
            value: 5
          },
          {
            name: 'originalPrice',
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 85000,
              fractionDigits: 2
            }
          },
          {
            name: 'barcodes',
            value: [
              {
                typeId: 'key-value-document',
                id: '8a14a95e-7628-495f-85f7-9553478b82ea',
                obj: {
                  id: '8a14a95e-7628-495f-85f7-9553478b82ea',
                  version: 1,
                  container: 'barcodes',
                  key: '89950453-01',
                  value: {
                    id: '89950453-01',
                    styleId: '20048361',
                    skuId: '-2913407',
                    subType: 'UPCE',
                    barcode: '89950453-01',
                    lastModifiedDate: 1560197040000
                  },
                  createdAt: '2020-03-31T20:27:02.045Z',
                  lastModifiedAt: '2020-03-31T20:27:02.045Z',
                  lastModifiedBy: {
                    clientId: '9YnDCNDg16EER7mWlMjXeHkF',
                    isPlatformClient: false
                  },
                  createdBy: {
                    clientId: '9YnDCNDg16EER7mWlMjXeHkF',
                    isPlatformClient: false
                  }
                }
              }
            ]
          }
        ],
        assets: []
      },
      price: {
        value: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 85000,
          fractionDigits: 2
        },
        id: '1160c52f-c16d-4390-8018-e26b2f96e1ff',
        country: 'CA',
        custom: {
          type: {
            typeId: 'type',
            id: 'af9c14ac-6b56-48d4-b152-2b751d2c9c24'
          },
          fields: {
            priceType: 'originalPrice'
          }
        }
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      taxRate: {
        name: '',
        amount: 0.13,
        includedInPrice: false,
        country: 'CA',
        subRates: [
          {
            name: 'HST',
            amount: 0.13
          }
        ]
      },
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '0e02ceb9-b46f-4e38-a494-38e67f2ae629'
          }
        }
      ],
      priceMode: 'Platform',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 85000,
        fractionDigits: 2
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 85000,
          fractionDigits: 2
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 85000,
          fractionDigits: 2
        }
      },
      custom: {
        type: {
          typeId: 'type',
          id: '72953947-9bf8-4d31-8a2e-9a9c22d40649'
        },
        fields: {
          itemTaxes: '{"HST":110.5}',
          isGift: true,
          salespersonId: 'sp-0001'
        }
      },
      lineItemMode: 'Standard',
      shippingDetails: {
        targets: [
          {
            addressKey: '9ee04fc1-17a5-4a83-9416-5cde81258c97',
            quantity: 1
          }
        ],
        valid: true
      }
    }
  ],
  customLineItems: [],
  transactionFee: true,
  discountCodes: [],
  cart: {
    typeId: 'cart',
    id: '4907963f-f36c-4874-83af-4c7b3c106594'
  },
  custom: {
    type: {
      typeId: 'type',
      id: '4525a9be-e60e-4d48-b27f-8c5d12b6aada'
    },
    fields: {
      cartSourceWebsite: '00990',
      sentToOmsStatus: 'PENDING',
      loginRadiusUid: 'ed6c636af37a4d738ba8d374fa219cbc',
      retryCount: 0,
      shippingTaxes: '{"HST":3.64}',
      giftMessage: 'Happy birthday'
    }
  },
  paymentInfo: {
    payments: [
      {
        typeId: 'payment',
        id: 'e507ad6d-4293-40da-a14a-9a8e7fa71bcc',
        obj: {
          id: 'e507ad6d-4293-40da-a14a-9a8e7fa71bcc',
          version: 1,
          lastMessageSequenceNumber: 1,
          createdAt: '2020-08-04T15:39:23.004Z',
          lastModifiedAt: '2020-08-04T15:39:23.004Z',
          lastModifiedBy: {
            clientId: 'k6QQpXCp89k8R8k7rwxem-h-',
            isPlatformClient: false
          },
          createdBy: {
            clientId: 'k6QQpXCp89k8R8k7rwxem-h-',
            isPlatformClient: false
          },
          amountPlanned: {
            type: 'centPrecision',
            currencyCode: 'CAD',
            centAmount: 99214,
            fractionDigits: 2
          },
          paymentMethodInfo: {
            paymentInterface: 'cybersource',
            method: 'credit',
            name: {
              en: 'CyberSource : cybersource'
            }
          },
          custom: {
            type: {
              typeId: 'type',
              id: 'c9a81e31-3fa6-4e73-8267-72cc3fd901b7'
            },
            fields: {
              transaction_card_last4: '1111',
              transaction_card_expiry: '11-2022',
              user_agent_string:
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
              avs_result: 'X',
              auth_number: '480',
              user_ip_address: '99.239.75.75',
              transaction_card_type: 'visa',
              transaction_time: '',
              bin: '4111',
              transaction_date: ''
            }
          },
          paymentStatus: {
            interfaceCode: 'paid',
            interfaceText: 'paid'
          },
          transactions: [
            {
              id: 'c3ab7cbb-d28f-4d82-9760-e9eaa317d33c',
              timestamp: '2020-08-04T15:39:18.076Z',
              type: 'Charge',
              amount: {
                type: 'centPrecision',
                currencyCode: 'CAD',
                centAmount: 99214,
                fractionDigits: 2
              },
              interactionId:
                '5965555601086316404009:Axj/7wSTQ2S2/FHfyd0pABEg3cMHDBm1bNIkGw3j2XKiOEbhdQQFRHCNwuoI+EcHHAbK8GkmXoxYg4kwJyaGyW34o7+TulIAMx4k',
              state: 'Success'
            }
          ],
          interfaceInteractions: []
        }
      }
    ]
  },
  shippingAddress: {
    firstName: 'Harry',
    lastName: 'Rosen',
    streetName: '55 Fake St',
    postalCode: 'M4V 1H6',
    city: 'Toronto',
    state: 'ON',
    country: 'CA',
    phone: '5551231234',
    email: 'user@gmail.com',
    key: '9ee04fc1-17a5-4a83-9416-5cde81258c97'
  },
  billingAddress: {
    firstName: 'Harry',
    lastName: 'Rosen',
    streetName: '55 Fake St',
    postalCode: 'M4V 1H6',
    city: 'Toronto',
    state: 'ON',
    country: 'CA',
    phone: '5551231234',
    email: 'user@gmail.com'
  },
  itemShippingAddresses: [
    {
      firstName: 'Harry',
      lastName: 'Rosen',
      streetName: '55 Fake St',
      postalCode: 'M4V 1H6',
      city: 'Toronto',
      state: 'ON',
      country: 'CA',
      phone: '5551231234',
      email: 'user@gmail.com',
      key: '9ee04fc1-17a5-4a83-9416-5cde81258c97'
    }
  ],
  refusedGifts: []
}

/** @type {import('./orders').Order} */
// @ts-ignore re-assigning to get around excess property checks
const completeOrderEnglish = completeOrderEnglishUntyped

describe('generateCsvStringFromOrder', () => {
  it('returns the correct CSV string when given a complete order whose locale is en-CA', () => {
    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED,GIFT_NOTE
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
"H","00990","23551711","Harry","Rosen",,"55 Fake St",,,"Toronto","ON","M4V 1H6","CA",,"Harry","Rosen","55 Fake St",,,"Toronto","ON","M4V 1H6","CA","5551231234","user@gmail.com","FDX","Y","N",,28,114.14,,992.14,,,,,,,"2020-08-04 11:39","ed6c636af37a4d738ba8d374fa219cbc",3.64,"HST-ON",,,,,,"00990",,,"EXPRESS",1,"N","N","Y","Happy birthday"
"D","00990",1,"23551711",,,,1,850,,850,0,110.5,850,"89950453-01","N","496332a3-45d9-4ed8-ae44-5b55693c89ce","Y",,,"sp-0001",,"UPCE"
"T","00990",1,"23551711",1,110.5,"HST-ON"
"N","00990",1,"23551711",992.14,"05","41","1122",,"1111","480"
`.split('\n').join('\r\n') // the expected string has Windows line breaks
    expect(generateCsvStringFromOrder(completeOrderEnglish)).toEqual(expectedOrderCsv)
  })

  it('returns the correct CSV string when given a complete order whose locale is fr-CA', () => {
    const completeOrderFrench = /** @type {import('./orders').Order} */ ({
      ...completeOrderEnglish,
      locale: 'fr-CA'
    })
    
    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED,GIFT_NOTE
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
"H","00990","23551711","Harry","Rosen",,"55 Fake St",,,"Toronto","ON","M4V 1H6","CA",,"Harry","Rosen","55 Fake St",,,"Toronto","ON","M4V 1H6","CA","5551231234","user@gmail.com","FDX","Y","N",,28,114.14,,992.14,,,,,,,"2020-08-04 11:39","ed6c636af37a4d738ba8d374fa219cbc",3.64,"HST-ON",,,,,,"00990",,,"EXPRESS",3,"N","N","Y","Happy birthday"
"D","00990",1,"23551711",,,,1,850,,850,0,110.5,850,"89950453-01","N","496332a3-45d9-4ed8-ae44-5b55693c89ce","Y",,,"sp-0001",,"UPCE"
"T","00990",1,"23551711",1,110.5,"HST-ON"
"N","00990",1,"23551711",992.14,"05","41","1122",,"1111","480"
`.split('\n').join('\r\n')
    expect(generateCsvStringFromOrder(completeOrderFrench)).toEqual(expectedOrderCsv)
  })

  it('returns the correct CSV string when given an order whose payment is not released', () => {
    const orderWithFailedPayment = { ...completeOrderEnglish }
    orderWithFailedPayment.paymentInfo.payments[0].obj.transactions[0]= { type: 'Charge', state: 'Pending' } 

    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED,GIFT_NOTE
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
"H","00990","23551711","Harry","Rosen",,"55 Fake St",,,"Toronto","ON","M4V 1H6","CA",,"Harry","Rosen","55 Fake St",,,"Toronto","ON","M4V 1H6","CA","5551231234","user@gmail.com","FDX","Y","N",,28,114.14,,992.14,,,,,,,"2020-08-04 11:39","ed6c636af37a4d738ba8d374fa219cbc",3.64,"HST-ON",,,,,,"00990",,,"EXPRESS",1,"N","N","N","Happy birthday"
"D","00990",1,"23551711",,,,1,850,,850,0,110.5,850,"89950453-01","N","496332a3-45d9-4ed8-ae44-5b55693c89ce","Y",,,"sp-0001",,"UPCE"
"T","00990",1,"23551711",1,110.5,"HST-ON"
"N","00990",1,"23551711",992.14,"05","41","1122",,"1111","480"
`.split('\n').join('\r\n')
    // @ts-ignore
    expect(generateCsvStringFromOrder(orderWithFailedPayment)).toEqual(expectedOrderCsv)
  })

  it('returns a CSV string with the `ENDLESS_AISLE_IND` set to Y for endless aisle items', () => {
    const orderWithEndlessAisleItem =  { ...completeOrderEnglish }
    orderWithEndlessAisleItem.lineItems[0].variant.attributes = [...completeOrderEnglish.lineItems[0].variant.attributes, { name: 'isEndlessAisle', value: true }]
    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED,GIFT_NOTE
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
"H","00990","23551711","Harry","Rosen",,"55 Fake St",,,"Toronto","ON","M4V 1H6","CA",,"Harry","Rosen","55 Fake St",,,"Toronto","ON","M4V 1H6","CA","5551231234","user@gmail.com","FDX","Y","N",,28,114.14,,992.14,,,,,,,"2020-08-04 11:39","ed6c636af37a4d738ba8d374fa219cbc",3.64,"HST-ON",,,,,,"00990",,,"EXPRESS",1,"N","N","N","Happy birthday"
"D","00990",1,"23551711",,,,1,850,,850,0,110.5,850,"89950453-01","Y","496332a3-45d9-4ed8-ae44-5b55693c89ce","Y",,,"sp-0001",,"UPCE"
"T","00990",1,"23551711",1,110.5,"HST-ON"
"N","00990",1,"23551711",992.14,"05","41","1122",,"1111","480"
`.split('\n').join('\r\n')
    expect(generateCsvStringFromOrder(completeOrderEnglish)).toEqual(expectedOrderCsv)
  })

  it('returns the correct CSV string when given a complete order when the cartSourceWebsite is 997', () => {
    const orderWith997CartSourceWebsite = { ...completeOrderEnglish }
    orderWith997CartSourceWebsite.custom.fields.cartSourceWebsite = '00997'
    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED,GIFT_NOTE
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
"H","00997","23551711","Harry","Rosen",,"55 Fake St",,,"Toronto","ON","M4V 1H6","CA",,"Harry","Rosen","55 Fake St",,,"Toronto","ON","M4V 1H6","CA","5551231234","user@gmail.com","FDX","Y","N",,28,114.14,,992.14,,,,,,,"2020-08-04 11:39","ed6c636af37a4d738ba8d374fa219cbc",3.64,"HST-ON",,,,,,"00997",,,"EXPRESS",1,"N","N","N","Happy birthday"
"D","00997",1,"23551711",,,,1,850,,850,0,110.5,850,"89950453-01","Y","496332a3-45d9-4ed8-ae44-5b55693c89ce","Y",,,"sp-0001",,"UPCE"
"T","00997",1,"23551711",1,110.5,"HST-ON"
"N","00997",1,"23551711",992.14,"05","41","1122",,"1111","480"
`.split('\n').join('\r\n') // the expected string has Windows line breaks
    expect(generateCsvStringFromOrder(orderWith997CartSourceWebsite)).toEqual(expectedOrderCsv)
  })


  it('returns the correct CSV string when given a complete order when the payment method is klarna and the value is above 9400', () => {
    const orderWithKlarnaPaymentAbove9400 = { ...completeOrderEnglishUntyped }
    
    orderWithKlarnaPaymentAbove9400.paymentInfo.payments[0].obj = {
      paymentMethodInfo:{
        paymentInterface:'plugin_v2',
        method:'plugin',
        name:{
          en:'plugin_v2'
        }
      },
      amountPlanned: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 94000,
        fractionDigits: 2
      },
      custom: {
        // @ts-ignore incomplete custom fields for testing purposes
        fields: {
          transaction_card_last4:'Klarna',
          transaction_card_expiry:'',
          auth_number:'authNumber',
          bin:'N/A',
          transaction_card_type:'klarna'
        }
      }
    }
    
    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED,GIFT_NOTE
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
"H","00997","23551711","Harry","Rosen",,"55 Fake St",,,"Toronto","ON","M4V 1H6","CA",,"Harry","Rosen","55 Fake St",,,"Toronto","ON","M4V 1H6","CA","5551231234","user@gmail.com","FDX","Y","N",,28,114.14,,940,,,,,,,"2020-08-04 11:39","ed6c636af37a4d738ba8d374fa219cbc",3.64,"HST-ON",,,,,,"00997",,,"EXPRESS",1,"N","Y","Y","Happy birthday"
"D","00997",1,"23551711",,,,1,850,,850,0,110.5,850,"89950453-01","Y","496332a3-45d9-4ed8-ae44-5b55693c89ce","Y",,,"sp-0001",,"UPCE"
"T","00997",1,"23551711",1,110.5,"HST-ON"
"N","00997",1,"23551711",940,"93",,,,,
`.split('\n').join('\r\n') // the expected string has Windows line breaks
    // @ts-ignore incomplete custom fields for testing purposes
    expect(generateCsvStringFromOrder(orderWithKlarnaPaymentAbove9400)).toEqual(expectedOrderCsv)
  })


  it('returns the correct CSV string when given a complete order when the payment method is klarna and the value is below 9400', () => {
    const orderWithKlarnaPaymentBelow9400 = { ...completeOrderEnglishUntyped }
    
    orderWithKlarnaPaymentBelow9400.paymentInfo.payments[0].obj = {
      paymentMethodInfo:{
        paymentInterface:'plugin_v2',
        method:'plugin',
        name:{
          en:'plugin_v2'
        }
      },
      amountPlanned: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 93990,
        fractionDigits: 2
      },
      custom: {
        // @ts-ignore incomplete custom fields for testing purposes
        fields: {
          transaction_card_last4:'Klarna',
          transaction_card_expiry:'',
          auth_number:'authNumber',
          bin:'N/A',
          transaction_card_type:'klarna'
        }
      }
    }
    
    const expectedOrderCsv = `RecordType H,SITE_ID,WFE_TRANS_ID,SHIP_TO_FIRST_NAME,SHIP_TO_LAST_NAME,,SHIP_TO_ADDRESS_1,SHIP_TO_ADDRESS_2,SHIP_TO_ADDRESS_3,SHIP_TO_CITY,SHIP_TO_STATE_ID,SHIP_TO_ZIP_CODE,SHIP_TO_COUNTRY_ID,WFE_CUSTOMER_ID,BILL_TO_FIRST_NAME,BILL_TO_LAST_NAME,BILL_TO_ADDRESS_1,BILL_TO_ADDRESS_2,BILL_TO_ADDRESS_3,BILL_TO_CITY,BILL_TO_STATE_ID,BILL_TO_ZIP_CODE,BILL_TO_COUNTRY_ID,BILL_TO_HOME_PHONE,EMAIL_ADDRESS,CARRIER_ID,RUSH_SHIPPING_IND,SHIP_COMPLETE_IND,,SHIPPING_CHARGES_TOTAL,TAX_TOTAL,,TRANSACTION_TOTAL,,POS_EQUIVALENCE,,,,,ORDER_DATE,ADDITIONAL_METADATA,SHIPPING_TAX1,SHIPPING_TAX1_DESCRIPTION,SHIPPING_TAX2,SHIPPING_TAX2_DESCRIPTION,SHIPPING_TAX3,SHIPPING_TAX3_DESCRIPTION,DESTINATION_SITE_ID,REQUESTER_SITE_ID,,,SERVICE_TYPE,LANGUAGE_NO,FREE_RETURN_IND,SIGNATURE_REQUIRED_IND,RELEASED,GIFT_NOTE
RecordType D,SITE_ID,LINE,WFE_TRANS_ID,,,,QTY_ORDERED,UNIT_PRICE,,EXTENSION_AMOUNT,LINE_SHIPPING_CHARGES,LINE_TOTAL_TAX,LINE_TOTAL_AMOUNT,BAR_CODE_ID,ENDLESS_AISLE_IND,EXT_REF_ID,GIFT_WRAP_IND,,,SALESPERSON_ID,ADDITIONAL_METADATA,SUB_TYPE
RecordType T,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,MERCHANDISE_TAX_AMOUNT,MERCHANDISE_TAX_DESC
RecordType N,SITE_ID,LINE,WFE_TRANS_ID,AMOUNT,POS_EQUIVALENCE,REFERENCENO,EXPDATE,,CARD_NO,AUTHORIZATION_NO
RecordType M,SITE_ID,LINE,WFE_TRANS_ID,SEQUENCE,AMOUNT,REASON_ID,MISC_TAX_AMOUNT1,MISC_TAX_DESC1,MISC_TAX_AMOUNT2,MISC_TAX_DESC2
"H","00997","23551711","Harry","Rosen",,"55 Fake St",,,"Toronto","ON","M4V 1H6","CA",,"Harry","Rosen","55 Fake St",,,"Toronto","ON","M4V 1H6","CA","5551231234","user@gmail.com","FDX","Y","N",,28,114.14,,939.9,,,,,,,"2020-08-04 11:39","ed6c636af37a4d738ba8d374fa219cbc",3.64,"HST-ON",,,,,,"00997",,,"EXPRESS",1,"N","N","Y","Happy birthday"
"D","00997",1,"23551711",,,,1,850,,850,0,110.5,850,"89950453-01","Y","496332a3-45d9-4ed8-ae44-5b55693c89ce","Y",,,"sp-0001",,"UPCE"
"T","00997",1,"23551711",1,110.5,"HST-ON"
"N","00997",1,"23551711",939.9,"93",,,,,
`.split('\n').join('\r\n') // the expected string has Windows line breaks
    // @ts-ignore incomplete custom fields for testing purposes
    expect(generateCsvStringFromOrder(orderWithKlarnaPaymentBelow9400)).toEqual(expectedOrderCsv)
  })

  it('returns strings that match example CSVs that were processed correctly by JESTA', () => {
    const exampleOrderNumbers = ['24600493', '24600955', '24839685', '24845933', '25068048', '24596603', '24738417', '24846490']

    for (const orderNumber of exampleOrderNumbers) {
      const rawOrderJson = readFileSync(path.join(__dirname, 'example-orders', `${orderNumber}.json`), 'utf8')
      const parsedOrderJson = JSON.parse(rawOrderJson)
      const expectedOrderCsvString = readFileSync(path.join(__dirname, 'example-orders', `${orderNumber}.csv`), 'utf8')
      const actualOrderCsvString = generateCsvStringFromOrder(parsedOrderJson)

      expect(actualOrderCsvString).toEqual(expectedOrderCsvString)
    }
  })
})
