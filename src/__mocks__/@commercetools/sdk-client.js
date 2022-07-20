const mockOrder = {
  type: 'Order',
  id: '1',
  version: 1,
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
  customerId: 'mockOrder',
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
  paymentState: 'Pending',
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
              'en-CA': 'construction',
              'fr-CA': 'construction' 
            }
          },
          {
            name: 'fabricAndMaterials',
            value: {
              'en-CA': 'fabricAndMaterials',
              'fr-CA': 'fabricAndMaterials'
            }
          },
          {
            name: 'styleAndMeasurements',
            value: {
              'en-CA': 'styleAndMeasurements',
              'fr-CA': 'styleAndMeasurements'
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
          isGift: false
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
      sentToOmsStatus: 'PENDING',
      paymentIsReleased: true,
      transactionTotal: {
        fractionDigits: 2,
        centAmount: 99214,
        currencyCode: 'CAD',
        type: 'centPrecision'
      },
      signatureIsRequired: true,
      loginRadiusUid: 'ed6c636af37a4d738ba8d374fa219cbc',
      returnsAreFree: true,
      shippingServiceType: 'EXPRESS',
      shippingIsRush: false,
      retryCount: 0,
      carrierId: 'FDX',
      shippingTaxes: '{"HST":3.64}'
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
            interfaceCode: 'preauthed',
            interfaceText: 'preauthed',
            'state': {
              'typeId': 'state',
              'id': 'a8521a92-b3c5-4a9e-94eb-24462bd3d486',
              'obj': {
                'id': 'a8521a92-b3c5-4a9e-94eb-24462bd3d486',
                'version': 1,
                'createdAt': '2020-10-05T19:03:19.984Z',
                'lastModifiedAt': '2020-10-05T19:03:19.984Z',
                'lastModifiedBy': {
                  'clientId': 'aPGUaMxkMVXpRJdxnjZlNYJ3',
                  'isPlatformClient': false
                },
                'createdBy': {
                  'clientId': 'aPGUaMxkMVXpRJdxnjZlNYJ3',
                  'isPlatformClient': false
                },
                'key': 'paid',
                'type': 'PaymentState',
                'roles': [],
                'name': {
                  'en-CA': 'Paid',
                  'fr-CA': 'Paid'
                },
                'builtIn': false,
                'initial': true
              }
            }
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
              state: 'Pending'
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
    streetName: 'Fake St',
    streetNumber: '55',
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
    streetName: 'Fake St',
    streetNumber: '55',
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
      streetName: 'Fake St',
      streetNumber: '55',
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

const mockOrderNoPayment = {
  'anonymousId': '11081e3e-bf99-44c3-beb0-8f5137b3910d',
  'billingAddress': {
    'city': 'Toronto',
    'country': 'CA',
    'email': 'user@gmail.com',
    'firstName': 'Harry',
    'lastName': 'Rosen',
    'phone': '5551231234',
    'postalCode': 'M4V 1H6',
    'state': 'ON',
    'streetName': 'Fake St',
    'streetNumber': '55'
  },
  'cart': {
    'id': '4907963f-f36c-4874-83af-4c7b3c106594',
    'typeId': 'cart'
  },
  'country': 'CA',
  'createdAt': '2020-08-04T15:39:23.259Z',
  'createdBy': {
    'clientId': 'k6QQpXCp89k8R8k7rwxem-h-',
    'isPlatformClient': false
  },
  'custom': {
    'fields': {
      'carrierId': 'FDX',
      'loginRadiusUid': 'ed6c636af37a4d738ba8d374fa219cbc',
      'paymentIsReleased': true,
      'retryCount': 0,
      'returnsAreFree': true,
      'sentToOmsStatus': 'PENDING',
      'shippingIsRush': false,
      'shippingServiceType': 'EXPRESS',
      'shippingTaxes': '{"HST":3.64}',
      'signatureIsRequired': true,
      'transactionTotal': {
        'centAmount': 0,
        'currencyCode': 'CAD',
        'fractionDigits': 2,
        'type': 'centPrecision'
      }
    },
    'type': {
      'id': '4525a9be-e60e-4d48-b27f-8c5d12b6aada',
      'typeId': 'type'
    }
  },
  'customLineItems': [],
  'customerEmail': 'user@gmail.com',
  'customerId': 'mockOrder',
  'discountCodes': [],
  'id': '1',
  'inventoryMode': 'None',
  'itemShippingAddresses': [{
    'city': 'Toronto',
    'country': 'CA',
    'email': 'user@gmail.com',
    'firstName': 'Harry',
    'key': '9ee04fc1-17a5-4a83-9416-5cde81258c97',
    'lastName': 'Rosen',
    'phone': '5551231234',
    'postalCode': 'M4V 1H6',
    'state': 'ON',
    'streetName': 'Fake St',
    'streetNumber': '55'
  }],
  'lastMessageSequenceNumber': 1,
  'lastModifiedAt': '2020-08-04T15:39:39.299Z',
  'lastModifiedBy': {
    'clientId': 'kCdIHF2Ojlv7-yp1Dq2itE4O',
    'isPlatformClient': false
  },
  'lineItems': [{
    'custom': {
      'fields': {
        'isGift': false,
        'itemTaxes': '{"HST":110.5}'
      },
      'type': {
        'id': '72953947-9bf8-4d31-8a2e-9a9c22d40649',
        'typeId': 'type'
      }
    },
    'discountedPricePerQuantity': [],
    'id': '496332a3-45d9-4ed8-ae44-5b55693c89ce',
    'lineItemMode': 'Standard',
    'name': {
      'en-CA': 'Huge6/Genius5 Suit ',
      'fr-CA': 'Complet Huge6/Genius5'
    },
    'price': {
      'country': 'CA',
      'custom': {
        'fields': {
          'priceType': 'originalPrice'
        },
        'type': {
          'id': 'af9c14ac-6b56-48d4-b152-2b751d2c9c24',
          'typeId': 'type'
        }
      },
      'id': '1160c52f-c16d-4390-8018-e26b2f96e1ff',
      'value': {
        'centAmount': 0,
        'currencyCode': 'CAD',
        'fractionDigits': 2,
        'type': 'centPrecision'
      }
    },
    'priceMode': 'Platform',
    'productId': 'b238f925-d071-4ac5-a00b-e2b5c335c74e',
    'productSlug': {
      'en-CA': '20052807',
      'fr-CA': '20052807'
    },
    'productType': {
      'id': '3f69b1dd-631c-4913-b015-c20c083a7940',
      'typeId': 'product-type'
    },
    'quantity': 1,
    'shippingDetails': {
      'targets': [{
        'addressKey': '9ee04fc1-17a5-4a83-9416-5cde81258c97',
        'quantity': 1
      }],
      'valid': true
    },
    'state': [{
      'quantity': 1,
      'state': {
        'id': '0e02ceb9-b46f-4e38-a494-38e67f2ae629',
        'typeId': 'state'
      }
    }],
    'taxRate': {
      'amount': 0.13,
      'country': 'CA',
      'includedInPrice': false,
      'name': '',
      'subRates': [{
        'amount': 0.13,
        'name': 'HST'
      }]
    },
    'taxedPrice': {
      'totalGross': {
        'centAmount': 0,
        'currencyCode': 'CAD',
        'fractionDigits': 2,
        'type': 'centPrecision'
      },
      'totalNet': {
        'centAmount': 0,
        'currencyCode': 'CAD',
        'fractionDigits': 2,
        'type': 'centPrecision'
      }
    },
    'totalPrice': {
      'centAmount': 0,
      'currencyCode': 'CAD',
      'fractionDigits': 2,
      'type': 'centPrecision'
    },
    'variant': {
      'assets': [],
      'attributes': [{
        'name': 'brandName',
        'value': {
          'en-CA': 'BOSS',
          'fr-CA': 'BOSS'
        }
      },
      {
        'name': 'construction',
        'value': {
          'en-CA': 'construction',
          'fr-CA': 'construction'
        }
      },
      {
        'name': 'fabricAndMaterials',
        'value': {
          'en-CA': 'fabricAndMaterials',
          'fr-CA': 'fabricAndMaterials'
        }
      },
      {
        'name': 'styleAndMeasurements',
        'value': {
          'en-CA': 'styleAndMeasurements',
          'fr-CA': 'styleAndMeasurements'
        }
      },
      {
        'name': 'careInstructions',
        'value': {
          'en-CA': '<li> Dry clean only',
          'fr-CA': '<li> Nettoyage à sec seulement'
        }
      },
      {
        'name': 'advice',
        'value': {
          'en-CA': '',
          'fr-CA': ''
        }
      }, {
        'name': 'webStatus',
        'value': true
      }, {
        'name': 'season',
        'value': 'FA-19'
      },
      {
        'name': 'vsn',
        'value': '50418716'
      }, {
        'name': 'relatedProductId',
        'value': '50418716030305BOSS'
      },
      {
        'name': 'styleLastModifiedInternal',
        'value': '2020-07-28T01:10:33.000Z'
      }, {
        'name': 'isOutlet',
        'value': false
      },
      {
        'name': 'styleOutletLastModifiedInternal',
        'value': '2020-07-27T14:05:00.000Z'
      }, {
        'name': 'colorId',
        'value': '402'
      }, {
        'name': 'dimensionId',
        'value': 'R'
      }, {
        'name': 'skuLastModifiedInternal',
        'value': '2020-07-09T14:09:52.000Z'
      }, {
        'name': 'size',
        'value': {
          'en-CA': '40',
          'fr-CA': '40'
        }
      }, {
        'name': 'sizeId',
        'value': '110'
      }, {
        'name': 'colour',
        'value': {
          'en-CA': 'Dark Blue',
          'fr-CA': 'Bleu marine'
        }
      }, {
        'name': 'colourGroup',
        'value': {
          'en-CA': 'Blue',
          'fr-CA': 'Bleu'
        }
      }, {
        'name': 'sizeChart',
        'value': 5
      }, {
        'name': 'originalPrice',
        'value': {
          'centAmount': 85000,
          'currencyCode': 'CAD',
          'fractionDigits': 2,
          'type': 'centPrecision'
        }
      }, {
        'name': 'barcodes',
        'value': [{
          'id': '8a14a95e-7628-495f-85f7-9553478b82ea',
          'obj': {
            'container': 'barcodes',
            'createdAt': '2020-03-31T20:27:02.045Z',
            'createdBy': {
              'clientId': '9YnDCNDg16EER7mWlMjXeHkF',
              'isPlatformClient': false
            },
            'id': '8a14a95e-7628-495f-85f7-9553478b82ea',
            'key': '89950453-01',
            'lastModifiedAt': '2020-03-31T20:27:02.045Z',
            'lastModifiedBy': {
              'clientId': '9YnDCNDg16EER7mWlMjXeHkF',
              'isPlatformClient': false
            },
            'value': {
              'barcode': '89950453-01',
              'id': '89950453-01',
              'lastModifiedDate': 1560197040000,
              'skuId': '-2913407',
              'styleId': '20048361',
              'subType': 'UPCE'
            },
            'version': 1
          },
          'typeId': 'key-value-document'
        }]
      }
      ],
      'id': 20,
      'images': [{
        'dimensions': {
          'h': 288,
          'w': 242
        },
        'url': 'https://i1.adis.ws/i/harryrosen/20052807?$prp-4col-xl$'
      }],
      'prices': [{
        'country': 'CA',
        'custom': {
          'fields': {
            'priceType': 'originalPrice'
          },
          'type': {
            'id': 'af9c14ac-6b56-48d4-b152-2b751d2c9c24',
            'typeId': 'type'
          }
        },
        'id': '1160c52f-c16d-4390-8018-e26b2f96e1ff',
        'value': {
          'centAmount': 0,
          'currencyCode': 'CAD',
          'fractionDigits': 2,
          'type': 'centPrecision'
        }
      }],
      'sku': '-2998709'
    }
  }],
  'locale': 'en-CA',
  'orderNumber': '23551711',
  'orderState': 'Open',
  'origin': 'Customer',
  'paymentState': 'paid',
  'refusedGifts': [],
  'returnInfo': [],
  'shipmentState': 'Pending',
  'shippingAddress': {
    'city': 'Toronto',
    'country': 'CA',
    'email': 'user@gmail.com',
    'firstName': 'Harry',
    'key': '9ee04fc1-17a5-4a83-9416-5cde81258c97',
    'lastName': 'Rosen',
    'phone': '5551231234',
    'postalCode': 'M4V 1H6',
    'state': 'ON',
    'streetName': 'Fake St',
    'streetNumber': '55'
  },
  'shippingInfo': {
    'deliveries': [],
    'price': {
      'centAmount': 0,
      'currencyCode': 'CAD',
      'fractionDigits': 2,
      'type': 'centPrecision'
    },
    'shippingMethodName': 'FedEx Priority Overnight',
    'shippingMethodState': 'MatchesCart',
    'shippingRate': {
      'price': {
        'centAmount': 0,
        'currencyCode': 'CAD',
        'fractionDigits': 2,
        'type': 'centPrecision'
      },
      'tiers': []
    },
    'taxRate': {
      'amount': 0.13,
      'country': 'CA',
      'includedInPrice': true,
      'name': '',
      'subRates': [{
        'amount': 0.13,
        'name': 'HST'
      }]
    },
    'taxedPrice': {
      'totalGross': {
        'centAmount': 0,
        'currencyCode': 'CAD',
        'fractionDigits': 2,
        'type': 'centPrecision'
      },
      'totalNet': {
        'centAmount': 0,
        'currencyCode': 'CAD',
        'fractionDigits': 2,
        'type': 'centPrecision'
      }
    }
  },
  'syncInfo': [],
  'taxCalculationMode': 'LineItemLevel',
  'taxMode': 'ExternalAmount',
  'taxRoundingMode': 'HalfEven',
  'taxedPrice': {
    'taxPortions': [{
      'amount': {
        'centAmount': 0,
        'currencyCode': 'CAD',
        'fractionDigits': 2,
        'type': 'centPrecision'
      },
      'name': 'HST',
      'rate': 0.13
    }],
    'totalGross': {
      'centAmount': 0,
      'currencyCode': 'CAD',
      'fractionDigits': 2,
      'type': 'centPrecision'
    },
    'totalNet': {
      'centAmount': 0,
      'currencyCode': 'CAD',
      'fractionDigits': 2,
      'type': 'centPrecision'
    }
  },
  'totalPrice': {
    'centAmount': 0,
    'currencyCode': 'CAD',
    'fractionDigits': 2,
    'type': 'centPrecision'
  },
  'transactionFee': true,
  'type': 'Order',
  'version': 1
}

const ctMockResponse = (orderId) => {
  if (orderId === 'orderNoLocale') {
    return { ...mockOrder, locale: null }
  } else if (orderId === 'orderFrLocale') {
    return { ...mockOrder, locale: 'fr-CA' }
  } else if (orderId === 'orderEnLocale') {
    return { ...mockOrder, locale: 'en-CA' }
  } else if (orderId === 'orderNoPayments') {
    return mockOrderNoPayment
  }
  return { results: [mockOrder] }
}

const mockClient = {
  execute: (params) => Promise.resolve({ body: ctMockResponse(params.uri) })
}

const sdkClient = {
  createClient: () => mockClient
}

module.exports = sdkClient
