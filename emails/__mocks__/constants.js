const COMPLETE_ORDER_ENGLISH_UNTYPED = {
  type: 'Order',
  id: '3d7a60fd-3108-497d-bb4a-def424b53553',
  version: 2,
  lastMessageSequenceNumber: 1,
  createdAt: '2020-05-27T17:46:34.019Z',
  lastModifiedAt: '2020-05-27T17:57:09.255Z',
  lastModifiedBy: {
    clientId: 'fWYPIVCZfSLvWu1GtNWc-Vbb',
    isPlatformClient: false,
  },
  createdBy: {
    clientId: 'fWYPIVCZfSLvWu1GtNWc-Vbb',
    isPlatformClient: false,
  },
  orderNumber: '122004',
  customerEmail: 'example01@example.com',
  locale: 'en-CA',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'CAD',
    centAmount: 53250,
    fractionDigits: 2,
  },
  orderState: 'Open',
  syncInfo: [],
  returnInfo: [],
  taxMode: 'ExternalAmount',
  inventoryMode: 'None',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  origin: 'Customer',
  lineItems: [
    {
      id: 'db2f65b2-e231-4197-abf5-3186290ff46a',
      productId: '0733f9d0-f49e-44fb-8941-7263f9e37b1e',
      name: {
        'en-CA': 'Embossed Leather Belt',
        'fr-CA': 'Ceinture en cuir estampé',
      },
      productType: {
        typeId: 'product-type',
        id: '3f69b1dd-631c-4913-b015-c20c083a7940',
      },
      productSlug: {
        'en-CA': '20046187',
        'fr-CA': '20046187',
      },
      variant: {
        id: 24,
        sku: '-2864801',
        prices: [
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 22500,
              fractionDigits: 2,
            },
            id: 'dd02d3af-a828-4e95-a665-488cc034043c',
          },
        ],
        images: [],
        attributes: [
          {
            name: 'brandName',
            value: {
              'fr-CA': 'Anderson\'s',
              'en-CA': 'Anderson\'s',
            },
          },
          {
            name: 'construction',
            value: {
              'fr-CA': '<li> Boucle ardillon\n<li> Fabriquée en Italie',
              'en-CA': '<li> Pin buckle\n<li> Made in Italy',
            },
          },
          {
            name: 'fabricAndMaterials',
            value: {
              'fr-CA':
                                '<li> Cuir\n<li> Effet bruni\n<li> Motif botanique estampé\n<li> Brun foncé',
              'en-CA':
                                '<li> Leather\n<li> Burnished finish\n<li> Embossed botanical pattern\n<li> Dark brown',
            },
          },
          {
            name: 'styleAndMeasurements',
            value: {
              'fr-CA':
                                '<li> Largeur : 3,2 cm (1,25 po)\n<li> Sélectionnez la ceinture qui mesure 2 po de plus (ou le nombre entier le plus proche) que le tour de taille de votre pantalon.',
              'en-CA':
                                '<li> Width: 1.25 in\n<li> Select one size (2 inches, to nearest even number) up from your trouser waist size for a standard fit',
            },
          },
          {
            name: 'careInstructions',
            value: {
              'fr-CA': '',
              'en-CA': '',
            },
          },
          {
            name: 'advice',
            value: {
              'fr-CA': '',
              'en-CA': '',
            },
          },
          {
            name: 'webStatus',
            value: true,
          },
          {
            name: 'season',
            value: 'FA-19',
          },
          {
            name: 'originalPrice',
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 22500,
              fractionDigits: 2,
            },
          },
          {
            name: 'vsn',
            value: 'A3387-AF3790/14-PL152-M1',
          },
          {
            name: 'relatedProductId',
            value: 'A3387-AF3790/14-PL152-M1375366Anderson\'s',
          },
          {
            name: 'styleLastModifiedInternal',
            value: '2019-09-06T04:09:45.000Z',
          },
          {
            name: 'colorId',
            value: '068',
          },
          {
            name: 'skuLastModifiedInternal',
            value: '2019-05-10T16:03:35.000Z',
          },
          {
            name: 'size',
            value: {
              'en-CA': '38',
            },
          },
          {
            name: 'sizeId',
            value: '99',
          },
          {
            name: 'isOnlineSale',
            value: false,
          },
          {
            name: 'onlineDiscount',
            value: 0,
          },
          {
            name: 'isOutlet',
            value: false,
          },
          {
            name: 'styleOutletLastModifiedInternal',
            value: '2019-10-15T14:50:00.000Z',
          },
        ],
        assets: [],
      },
      price: {
        value: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 22500,
          fractionDigits: 2,
        },
        id: 'dd02d3af-a828-4e95-a665-488cc034043c',
      },
      quantity: 2,
      discountedPrice: {
        value: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 16875,
          fractionDigits: 2,
        },
        includedDiscounts: [
          {
            discount: {
              typeId: 'cart-discount',
              id: '9b40c0c6-80f8-4b48-b1d2-43df8cf15d26',
            },
            discountedAmount: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 5625,
              fractionDigits: 2,
            },
          },
        ],
      },
      discountedPricePerQuantity: [
        {
          quantity: 2,
          discountedPrice: {
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 16875,
              fractionDigits: 2,
            },
            includedDiscounts: [
              {
                discount: {
                  typeId: 'cart-discount',
                  id: '9b40c0c6-80f8-4b48-b1d2-43df8cf15d26',
                },
                discountedAmount: {
                  type: 'centPrecision',
                  currencyCode: 'CAD',
                  centAmount: 5625,
                  fractionDigits: 2,
                },
              },
            ],
          },
        },
      ],
      taxRate: {
        name: 'HST',
        amount: 0.13,
        includedInPrice: false,
        country: 'CA',
        state: 'ON',
        subRates: [],
      },
      state: [
        {
          quantity: 2,
          state: {
            typeId: 'state',
            id: '0e02ceb9-b46f-4e38-a494-38e67f2ae629',
          },
        },
      ],
      priceMode: 'Platform',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 33750,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 33750,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 38137,
          fractionDigits: 2,
        },
      },
      custom: {
        type: {
          typeId: 'type',
          id: '72953947-9bf8-4d31-8a2e-9a9c22d40649',
        },
        fields: {
          salespersonId: 355216,
          isGift: true,
          lineTaxDescription: 'HST-ON',
          lineTotalTax: {
            fractionDigits: 2,
            centAmount: 4387,
            currencyCode: 'CAD',
            type: 'centPrecision',
          },
          barcodeData: [
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
          lineShippingCharges: {
            fractionDigits: 2,
            centAmount: 550,
            currencyCode: 'CAD',
            type: 'centPrecision',
          },
        },
      },
      lineItemMode: 'Standard',
    },
    {
      id: '328613b8-9f8a-4de6-95c4-f1d6ef7da755',
      productId: 'f6b5a911-69e8-4d00-85a6-958ab72d2ede',
      name: {
        'en-CA': 'The Tellis Modern Slim Fit Jeans',
        'fr-CA': 'Jean de coupe moderne amincie\\, modèle Tellis',
      },
      productType: {
        typeId: 'product-type',
        id: '3f69b1dd-631c-4913-b015-c20c083a7940',
      },
      productSlug: {
        'en-CA': '20034684',
        'fr-CA': '20034684',
      },
      variant: {
        id: 2,
        sku: '-2651290',
        prices: [
          {
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 26000,
              fractionDigits: 2,
            },
            id: '55af6537-e55a-48d9-8f28-1fd7ec554433',
          },
        ],
        images: [],
        attributes: [
          {
            name: 'brandName',
            value: {
              'fr-CA': 'AG',
              'en-CA': 'AG',
            },
          },
          {
            name: 'construction',
            value: {
              'fr-CA': '<li> Braguette à glissière\n<li> Cinq poches',
              'en-CA': '<li> Zipper fly\n<li> Five-pocket style',
            },
          },
          {
            name: 'fabricAndMaterials',
            value: {
              'fr-CA':
                                '<li> 98 % coton, 2 % polyuréthane\n<li> Écusson-logo en cuir sur la taille\n<li> Délavage foncé\n<li> Bleu marine',
              'en-CA':
                                '<li> 98% cotton, 2% polyurethane\n<li> Leather logo patch on waistband\n<li> Dark wash\n<li> Navy',
            },
          },
          {
            name: 'styleAndMeasurements',
            value: {
              'fr-CA':
                                '<li> Coupe amincie\n<li> Coupe moderne amincie Tellis d¿AG\n<li> Taille moyenne\n<li> Fourche avant de 25,4 cm (10 po)\n<li> Fourche arrière de 35,6 cm (14 po)\n<li> Entrejambe de 83,8 cm (33 po)\n<li> Mesures prises sur la taille 32',
              'en-CA':
                                '<li> Slim fit\n<li> AG The Tellis Modern Slim fit\n<li> Mid-rise style\n<li> Front rise: 10 in\n<li> Back rise: 14 in\n<li> Inseam: 33 in\n<li> Measurements are based on size 32',
            },
          },
          {
            name: 'careInstructions',
            value: {
              'fr-CA':
                                '<li> Laver à la machine à l¿eau froide\n<li> Sécher par culbutage à température moyenne\n<li> Repasser à température moyenne\n<li> Ne pas nettoyer à sec',
              'en-CA':
                                '<li> Machine wash, cold\n<li> Tumble dry, medium\n<li> Iron, medium\n<li> Do not dry clean',
            },
          },
          {
            name: 'advice',
            value: {
              'fr-CA': '',
              'en-CA': '',
            },
          },
          {
            name: 'webStatus',
            value: true,
          },
          {
            name: 'season',
            value: 'BASIC',
          },
          {
            name: 'originalPrice',
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 26000,
              fractionDigits: 2,
            },
          },
          {
            name: 'vsn',
            value: 'TLS',
          },
          {
            name: 'relatedProductId',
            value: 'TLS465437AG',
          },
          {
            name: 'styleLastModifiedInternal',
            value: '2020-05-07T08:20:57.000Z',
          },
          {
            name: 'colorId',
            value: '049',
          },
          {
            name: 'skuLastModifiedInternal',
            value: '2018-08-23T20:03:18.000Z',
          },
          {
            name: 'size',
            value: {
              'en-CA': '36',
            },
          },
          {
            name: 'sizeId',
            value: '95',
          },
          {
            name: 'isOnlineSale',
            value: false,
          },
          {
            name: 'onlineDiscount',
            value: 0,
          },
          {
            name: 'isOutlet',
            value: false,
          },
          {
            name: 'styleOutletLastModifiedInternal',
            value: '2019-12-19T18:48:26.000Z',
          },
          {
            name: 'colour',
            value: {
              'en-CA': 'Indigo',
              'fr-CA': 'Bleu indigo',
            },
          },
          {
            name: 'colourGroup',
            value: {
              'en-CA': 'Blue',
              'fr-CA': 'Bleu',
            },
          },
        ],
        assets: [],
      },
      price: {
        value: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 26000,
          fractionDigits: 2,
        },
        id: '55af6537-e55a-48d9-8f28-1fd7ec554433',
      },
      quantity: 1,
      discountedPrice: {
        value: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 19500,
          fractionDigits: 2,
        },
        includedDiscounts: [
          {
            discount: {
              typeId: 'cart-discount',
              id: '9b40c0c6-80f8-4b48-b1d2-43df8cf15d26',
            },
            discountedAmount: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 6500,
              fractionDigits: 2,
            },
          },
        ],
      },
      discountedPricePerQuantity: [
        {
          quantity: 1,
          discountedPrice: {
            value: {
              type: 'centPrecision',
              currencyCode: 'CAD',
              centAmount: 19500,
              fractionDigits: 2,
            },
            includedDiscounts: [
              {
                discount: {
                  typeId: 'cart-discount',
                  id: '9b40c0c6-80f8-4b48-b1d2-43df8cf15d26',
                },
                discountedAmount: {
                  type: 'centPrecision',
                  currencyCode: 'CAD',
                  centAmount: 6500,
                  fractionDigits: 2,
                },
              },
            ],
          },
        },
      ],
      taxRate: {
        name: 'HST',
        amount: 0.13,
        includedInPrice: false,
        country: 'CA',
        state: 'ON',
        subRates: [],
      },
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '0e02ceb9-b46f-4e38-a494-38e67f2ae629',
          },
        },
      ],
      priceMode: 'Platform',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'CAD',
        centAmount: 19500,
        fractionDigits: 2,
      },
      taxedPrice: {
        totalNet: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 19500,
          fractionDigits: 2,
        },
        totalGross: {
          type: 'centPrecision',
          currencyCode: 'CAD',
          centAmount: 22035,
          fractionDigits: 2,
        },
      },
      custom: {
        type: {
          typeId: 'type',
          id: '72953947-9bf8-4d31-8a2e-9a9c22d40649',
        },
        fields: {
          salespersonId: 355216,
          isGift: false,
          lineTaxDescription: 'HST-ON',
          lineTotalTax: {
            type: 'centPrecision',
            currencyCode: 'CAD',
            centAmount: 2535,
            fractionDigits: 2,
          },
          barcodeData: [
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
          lineShippingCharges: {
            type: 'centPrecision',
            currencyCode: 'CAD',
            centAmount: 550,
            fractionDigits: 2,
          },
        },
      },
      lineItemMode: 'Standard',
    },
  ],
  customLineItems: [],
  transactionFee: true,
  discountCodes: [],
  cart: {
    typeId: 'cart',
    id: '2b8ba61e-2ac9-4142-9efd-49c4b80e04c3',
  },
  custom: {
    type: {
      typeId: 'type',
      id: '4525a9be-e60e-4d48-b27f-8c5d12b6aada',
    },
    fields: {
      shippingTax: {
        fractionDigits: 2,
        centAmount: 130,
        currencyCode: 'CAD',
        type: 'centPrecision',
      },
      paymentIsReleased: true,
      shippingCost: {
        fractionDigits: 2,
        centAmount: 1000,
        currencyCode: 'CAD',
        type: 'centPrecision',
      },
      shippingIsRush: true,
      transactionTotal: {
        fractionDigits: 2,
        centAmount: 54380,
        currencyCode: 'CAD',
        type: 'centPrecision',
      },
      signatureIsRequired: false,
      shippingTaxDescription: 'HST-ON',
      totalOrderTax: {
        fractionDigits: 2,
        centAmount: 7052,
        currencyCode: 'CAD',
        type: 'centPrecision',
      },
      carrierId: 'FDX',
      returnsAreFree: false,
      shippingServiceType: 'EXPEDITED PARCEL',
      loginRadiusUid: '5338a1ad522b47198682616ba6804a29'
    },
  },
  paymentInfo: {
    payments: [
      {
        typeId: 'payment',
        id: '2843b6d1-8497-45b3-a9a5-cc01a187ba51',
        obj: {
          id: '2843b6d1-8497-45b3-a9a5-cc01a187ba51',
          version: 2,
          lastMessageSequenceNumber: 1,
          createdAt: '2020-05-26T18:53:57.098Z',
          lastModifiedAt: '2020-05-26T19:21:23.444Z',
          lastModifiedBy: {
            clientId: 'fWYPIVCZfSLvWu1GtNWc-Vbb',
            isPlatformClient: false,
          },
          createdBy: {
            clientId: 'fWYPIVCZfSLvWu1GtNWc-Vbb',
            isPlatformClient: false,
          },
          amountPlanned: {
            type: 'centPrecision',
            currencyCode: 'CAD',
            centAmount: 54380,
            fractionDigits: 2,
          },
          paymentMethodInfo: {
            method: '05',
          },
          custom: {
            type: {
              typeId: 'type',
              id: 'c9a81e31-3fa6-4e73-8267-72cc3fd901b7',
            },
            fields: {
              cardReferenceNumber: '19',
              cardExpiryDate: '0525',
              cardNumber: '1212',
              authorizationNumber: '12345',
            },
          },
          paymentStatus: {},
          transactions: [],
          interfaceInteractions: [],
        },
      },
    ],
  },
  shippingAddress: {
    firstName: 'Harry',
    lastName: 'Rosen',
    additionalStreetInfo: '218 Young Street\n#1246',
    postalCode: 'M5B 2H6',
    state: 'ON',
    city: 'Toronto',
    country: 'CA',
    phone: '(416) 598-8885',
  },
  billingAddress: {
    firstName: 'Harry',
    lastName: 'Rosen',
    additionalStreetInfo: '218 Young Street\n#1246',
    postalCode: 'M5B 2H6',
    city: 'Toronto',
    state: 'ON',
    country: 'CA',
    phone: '(416) 598-8885',
  },
  itemShippingAddresses: [],
  refusedGifts: [],
};

module.exports = { COMPLETE_ORDER_ENGLISH_UNTYPED };