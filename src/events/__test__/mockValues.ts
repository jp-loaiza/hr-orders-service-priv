const taxPortions = [
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

export function mockOrder(
    sentToOmsStatus: string,
    omsUpdate: string,
    createdDate: string = new Date().toJSON()) {
    return {
        type: 'Order',
        id: '6feea16b-a8b1-4d3e-a602-8be1a70d0e05',
        version: 5,
        lastMessageSequenceNumber: 1,
        state: { typeId: 'typeId', id: 'string' },
        createdAt: createdDate,
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
            fractionDigits: 2,
            preciseAmount: 85000
        },
        taxedPrice: {
            totalNet: {
                type: 'centPrecision',
                currencyCode: 'CAD',
                centAmount: 87800,
                fractionDigits: 2,
                preciseAmount: 87800
            },
            totalGross: {
                type: 'centPrecision',
                currencyCode: 'CAD',
                centAmount: 99214,
                fractionDigits: 2,
                preciseAmount: 99214
            },
            taxPortions
        },
        taxedPricePortions: [],
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
                fractionDigits: 2,
                preciseAmount: 2800
            },
            shippingRate: {
                price: {
                    type: 'centPrecision',
                    currencyCode: 'CAD',
                    centAmount: 2800,
                    fractionDigits: 2,
                    preciseAmount: 2800
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
            perMethodTaxRate: [],
            deliveries: [],
            taxedPrice: {
                totalNet: {
                    type: 'centPrecision',
                    currencyCode: 'CAD',
                    centAmount: 2800,
                    fractionDigits: 2,
                    preciseAmount: 2800
                },
                totalGross: {
                    type: 'centPrecision',
                    currencyCode: 'CAD',
                    centAmount: 3164,
                    fractionDigits: 2,
                    preciseAmount: 3164
                },
                taxPortions
            },
            taxedPricePortions: [],
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
                    prices: [],
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
                                fractionDigits: 2,
                                preciseAmount: 85000
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
                        fractionDigits: 2,
                        preciseAmount: 85000
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
                perMethodTaxRate: [],
                state: [],
                priceMode: 'Platform',
                totalPrice: {
                    type: 'centPrecision',
                    currencyCode: 'CAD',
                    centAmount: 85000,
                    fractionDigits: 2,
                    preciseAmount: 85000
                },
                taxedPrice: {
                    totalNet: {
                        type: 'centPrecision',
                        currencyCode: 'CAD',
                        centAmount: 85000,
                        fractionDigits: 2,
                        preciseAmount: 85000
                    },
                    totalGross: {
                        type: 'centPrecision',
                        currencyCode: 'CAD',
                        centAmount: 85000,
                        fractionDigits: 2,
                        preciseAmount: 99214
                    },
                    taxPortions
                },
                taxedPricePortions: [],
                custom: {
                    type: {
                        typeId: 'type',
                        id: '72953947-9bf8-4d31-8a2e-9a9c22d40649'
                    },
                    fields: {
                        itemTaxes: '{"HST":110.5}',
                        isGift: false,
                        orderDetailLastModifiedDate: '2022-06-08T20:27:02.045Z',
                        algoliaAnalyticsData: {
                            'typeId': 'key-value-document',
                            'id': '56b2c185-10ad-4232-914d-311ca3147f3f'
                        }
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
                },
                lastModifiedAt: '2022-06-08T20:27:02.045Z',
                product_type: null,
                product_id: null,
                dimensions: null,
                is_backordered: null,
                vendor: null,
                item_promise_date: null,
                return_reason_code: null,
                events: null,
                color: null,
                size: null,
                style: null,
                original_unit_price: null,
                original_line_price: null,
                narvar_convert_id: null
            },
            {
                "id": "99a15373-8c39-4ef5-9dbd-a637ee0085ef",
                "productId": "ed6014b3-8d38-4231-98f5-23d823a98b9f",
                "name": {
                    "en-CA": "Impeccabile Printed Cotton Dress Shirt",
                    "fr-CA": "Chemise habillée imprimée en tissu Impeccabile"
                },
                "productType": {
                    "typeId": "product-type",
                    "id": "2dc01154-c743-4d36-8d4a-71b1504bfe3b"
                },
                "productSlug": {
                    "en-CA": "20056853",
                    "fr-CA": "20056853"
                },
                "variant": {
                    "id": 4,
                    "sku": "-3078373",
                    "prices": [
                        {
                            "id": "b424b38d-2d35-4e40-85ad-d1b2e210ee69",
                            "value": {
                                "type": "centPrecision",
                                "currencyCode": "CAD",
                                "centAmount": 12999,
                                "fractionDigits": 2
                            },
                            "country": "CA",
                            "custom": {
                                "type": {
                                    "typeId": "type",
                                    "id": "493275e3-23ad-492c-9ed1-7a174ad43182"
                                },
                                "fields": {
                                    "priceType": "permanentMarkdown",
                                    "priceChangeId": "5569",
                                    "processDateCreated": "2021-07-02T13:43:21.000Z"
                                }
                            }
                        },
                        {
                            "id": "58a4bf7c-a940-4aae-ad6f-99af9c701406",
                            "value": {
                                "type": "centPrecision",
                                "currencyCode": "CAD",
                                "centAmount": 24299,
                                "fractionDigits": 2
                            },
                            "country": "CA",
                            "validFrom": "2021-05-27T04:00:00.000Z",
                            "validUntil": "2021-05-31T03:59:58.000Z",
                            "custom": {
                                "type": {
                                    "typeId": "type",
                                    "id": "493275e3-23ad-492c-9ed1-7a174ad43182"
                                },
                                "fields": {
                                    "processDateCreated": "2021-05-26T14:40:29.000Z",
                                    "priceChangeId": "5486",
                                    "priceType": "temporaryMarkdown"
                                }
                            }
                        }
                    ],
                    "images": [
                        {
                            "url": "https://i1.adis.ws/i/harryrosen/20056853?$prp-4col-xl$",
                            "dimensions": {
                                "w": 242,
                                "h": 288
                            }
                        }
                    ],
                    "attributes": [
                        {
                            "name": "brandName",
                            "value": {
                                "fr-CA": "Canali",
                                "en-CA": "Canali"
                            }
                        },
                        {
                            "name": "construction",
                            "value": {
                                "fr-CA": "<li> Col italien\n<li> Poignets arrondis boutonnés\n<li> Baleines de col amovibles\n<li> Résistance au froissement\n<li> Fabriquée en Italie",
                                "en-CA": "<li> Spread collar\n<li> Single button rounded cuffs\n<li> Removable collar stays\n<li> Wrinkle-resistant\n<li> Made in Italy"
                            }
                        },
                        {
                            "name": "fabricAndMaterials",
                            "value": {
                                "fr-CA": "<li> 100 % coton\n<li> Tissu Impeccabile\n<li> Motif répété\n<li> Rose",
                                "en-CA": "<li> 100% cotton\n<li> Impeccabile finish\n<li> Neat pattern\n<li> Pink"
                            }
                        },
                        {
                            "name": "styleAndMeasurements",
                            "value": {
                                "fr-CA": "<li> Coupe contemporaine\n<li> Coupe moderne de Canali",
                                "en-CA": "<li> Contemporary fit\n<li> Canali Modern fit"
                            }
                        },
                        {
                            "name": "careInstructions",
                            "value": {
                                "fr-CA": "<li> Lavage à la machine à l’eau froide\n<li> Pas de séchage par culbutage\n<li> Repassage à température moyenne\n<li> Nettoyage à sec possible",
                                "en-CA": "<li> Machine wash, cold\n<li> Do not tumble dry\n<li> Iron, medium\n<li> Dry clean safe"
                            }
                        },
                        {
                            "name": "advice",
                            "value": {
                                "fr-CA": "",
                                "en-CA": ""
                            }
                        },
                        {
                            "name": "colour",
                            "value": {
                                "en-CA": "Pink",
                                "fr-CA": "Rose"
                            }
                        },
                        {
                            "name": "colourGroup",
                            "value": {
                                "fr-CA": "Rose",
                                "en-CA": "Pink"
                            }
                        },
                        {
                            "name": "webStatus",
                            "value": true
                        },
                        {
                            "name": "season",
                            "value": "SP-20"
                        },
                        {
                            "name": "originalPrice",
                            "value": {
                                "type": "centPrecision",
                                "currencyCode": "CAD",
                                "centAmount": 32500,
                                "fractionDigits": 2
                            }
                        },
                        {
                            "name": "vsn",
                            "value": "GR01579"
                        },
                        {
                            "name": "relatedProductId",
                            "value": "GR01579246521Canali"
                        },
                        {
                            "name": "styleLastModifiedInternal",
                            "value": "2021-09-06T14:04:11.000Z"
                        },
                        {
                            "name": "isOutlet",
                            "value": false
                        },
                        {
                            "name": "styleOutletLastModifiedInternal",
                            "value": "2021-09-06T16:30:54.000Z"
                        },
                        {
                            "name": "sizeChart",
                            "value": 10
                        },
                        {
                            "name": "colorId",
                            "value": "055"
                        },
                        {
                            "name": "skuLastModifiedInternal",
                            "value": "2019-12-04T17:03:59.000Z"
                        },
                        {
                            "name": "size",
                            "value": {
                                "en-CA": "17.5",
                                "fr-CA": "17.5"
                            }
                        },
                        {
                            "name": "sizeId",
                            "value": "68"
                        },
                        {
                            "name": "barcodes",
                            "value": [
                                {
                                    "typeId": "key-value-document",
                                    "id": "ba952559-8aba-40f0-932b-0abf216befdc"
                                }
                            ]
                        },
                        {
                            "name": "onSale",
                            "value": true
                        },
                        {
                            "name": "hasOnlineAts",
                            "value": true
                        },
                        {
                            "name": "isEndlessAisle",
                            "value": false
                        },
                        {
                            "name": "isReturnable",
                            "value": true
                        },
                        {
                            "name": "brandId",
                            "value": "1"
                        }
                    ],
                    "assets": []
                },
                "price": {
                    "id": "b424b38d-2d35-4e40-85ad-d1b2e210ee69",
                    "value": {
                        "type": "centPrecision",
                        "currencyCode": "CAD",
                        "centAmount": 12999,
                        "fractionDigits": 2
                    },
                    "country": "CA",
                    "custom": {
                        "type": {
                            "typeId": "type",
                            "id": "493275e3-23ad-492c-9ed1-7a174ad43182"
                        },
                        "fields": {
                            "priceType": "permanentMarkdown",
                            "priceChangeId": "5569",
                            "processDateCreated": "2021-07-02T13:43:21.000Z"
                        }
                    }
                },
                "quantity": 1,
                "discountedPricePerQuantity": [],
                "taxRate": {
                    "name": "",
                    "amount": 0.13,
                    "includedInPrice": false,
                    "country": "CA",
                    "subRates": [
                        {
                            "name": "HST",
                            "amount": 0.13
                        }
                    ]
                },
                "perMethodTaxRate": [],
                "addedAt": "2021-09-06T01:53:41.389Z",
                "lastModifiedAt": "2021-09-06T20:29:07.600Z",
                "state": [
                    {
                        "quantity": 1,
                        "state": {
                            "typeId": "state",
                            "id": "bf63e3e1-9706-4006-80a9-f2b597091676"
                        }
                    }
                ],
                "priceMode": "Platform",
                "lineItemMode": "Standard",
                "totalPrice": {
                    "type": "centPrecision",
                    "currencyCode": "CAD",
                    "centAmount": 12999,
                    "fractionDigits": 2
                },
                "taxedPrice": {
                    "totalNet": {
                        "type": "centPrecision",
                        "currencyCode": "CAD",
                        "centAmount": 12999,
                        "fractionDigits": 2
                    },
                    "totalGross": {
                        "type": "centPrecision",
                        "currencyCode": "CAD",
                        "centAmount": 14689,
                        "fractionDigits": 2
                    }
                },
                "taxedPricePortions": [],
                "custom": {
                    "type": {
                        "typeId": "type",
                        "id": "71f02695-a9b5-4f17-97ff-ccf3c78b66f3"
                    },
                    "fields": {
                        "itemTaxes": "{\"HST\":16.898699999999998}",
                        "isGift": false,
                        "orderDetailLastModifiedDate": "2021-09-08T16:12:03.000Z",
                        "quantityCancelled": 0,
                        "algoliaAnalyticsData": {
                            "typeId": "key-value-document",
                            "id": "6b1901a5-8546-47ff-baa7-d8828a15dd2a"
                        }
                    }
                },
                "shippingDetails": {
                    "targets": [
                        {
                            "addressKey": "350a41e9-bd15-49b4-89bf-eae99b472d4b",
                            "quantity": 1
                        }
                    ],
                    "valid": true
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
                orderDetailLastModifiedDate: '2022-06-08T20:27:02.045Z',
                itemTaxes: 'itemTaxes',
                isGift: false,
                sentToOmsStatus: sentToOmsStatus,
                omsUpdate: omsUpdate,
                paymentIsReleased: true,
                transactionTotal: {
                    fractionDigits: 2,
                    centAmount: 99214,
                    currencyCode: 'CAD',
                    type: 'centPrecision',
                    preciseAmount: 99214
                },
                signatureIsRequired: true,
                loginRadiusUid: 'ed6c636af37a4d738ba8d374fa219cbc',
                returnsAreFree: true,
                shippingServiceType: 'EXPRESS',
                shippingIsRush: false,
                retryCount: 0,
                carrierId: 'FDX',
                shippingTaxes: '{"HST":3.64}',
                dynamicYieldData: {},
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
                            fractionDigits: 2,
                            preciseAmount: 99214
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
                                type: 'Authorization',
                                amount: {
                                    type: 'centPrecision',
                                    currencyCode: 'CAD',
                                    centAmount: 99214,
                                    fractionDigits: 2,
                                    preciseAmount: 99214
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
        itemShippingAddress:
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
        },
        refusedGifts: [],
        shippingMode: 'standard',
        shipping: []
    }

}