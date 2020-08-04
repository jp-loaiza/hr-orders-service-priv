const validOrder = {
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
          isGift: false,
          barcodeData: [ // Note: manually set because barcode because this item was missing a barcode
            {
              typeId: 'key-value-document',
              id: '788f4dc4-049a-4cef-9cdd-eb13293714de',
              obj: {
                id: '788f4dc4-049a-4cef-9cdd-eb13293714de',
                version: 1,
                container: 'barcodes',
                key: '22360227-05',
                value: {
                  id: '22360227-05',
                  styleId: '22360227',
                  skuId: '-754864',
                  subType: 'UPCE',
                  barcode: '22360227-05',
                  lastModifiedDate: 1459699210000,
                },
                createdAt: '2020-03-31T16:55:02.111Z',
                lastModifiedAt: '2020-03-31T16:55:02.111Z',
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
            interfaceText: 'preauthed'
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

const invalidOrder = { orderNumber: 'testOrderThatIsInvalid' }

module.exports = {
  fetchOrdersThatShouldBeSentToOms: jest.fn()
    .mockImplementationOnce(() => [validOrder, invalidOrder])
    .mockImplementationOnce(() => [invalidOrder, validOrder])
    .mockImplementationOnce(() => [validOrder])
    .mockImplementationOnce(() => []),
  setOrderAsSentToOms: jest.fn(),
  setOrderErrorFields: jest.fn()  
}
