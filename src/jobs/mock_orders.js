const payPalPayment =  {
  'type': 'Order',
  'id': '0157a028-6c8f-4f7c-8806-5af8fb727d1d',
  'version': 99,
  'lastMessageSequenceNumber': 13,
  'createdAt': '2022-06-14T14:14:01.166Z',
  'lastModifiedAt': '2022-06-14T19:42:38.487Z',
  'lastModifiedBy': {
    'clientId': 'zYxXiV2BA7lsH-NwacYsONon',
    'isPlatformClient': false
  },
  'createdBy': {
    'clientId': 'Q7Ct9f3B8iSG-DCGSOj3uk_8',
    'isPlatformClient': false
  },
  'orderNumber': '67669340',
  'customerId': 'd9a3959e-2a2e-4ae1-ab48-a61451b38b79',
  'customerEmail': 'd.ogilvie91@yahoo.com',
  'customerGroup': {
    'typeId': 'customer-group',
    'id': 'ad6c3a6c-cbc6-4dc3-a7b8-7288b8f8a9cd'
  },
  'anonymousId': 'bc10403c-0380-4956-af30-f2d454f30817',
  'locale': 'en-CA',
  'totalPrice': {
    'type': 'centPrecision',
    'currencyCode': 'CAD',
    'centAmount': 9000,
    'fractionDigits': 2
  },
  'taxedPrice': {
    'totalNet': {
      'type': 'centPrecision',
      'currencyCode': 'CAD',
      'centAmount': 9000,
      'fractionDigits': 2
    },
    'totalGross': {
      'type': 'centPrecision',
      'currencyCode': 'CAD',
      'centAmount': 10170,
      'fractionDigits': 2
    },
    'taxPortions': [
      {
        'rate': 0.13,
        'amount': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 1170,
          'fractionDigits': 2
        },
        'name': 'HST'
      }
    ],
    'totalTax': {
      'type': 'centPrecision',
      'currencyCode': 'CAD',
      'centAmount': 1170,
      'fractionDigits': 2
    }
  },
  'country': 'CA',
  'orderState': 'Confirmed',
  'shipmentState': 'Pending',
  'paymentState': 'Paid',
  'syncInfo': [],
  'returnInfo': [],
  'shippingInfo': {
    'shippingMethodName': 'Standard',
    'price': {
      'type': 'centPrecision',
      'currencyCode': 'CAD',
      'centAmount': 0,
      'fractionDigits': 2
    },
    'shippingRate': {
      'price': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'tiers': []
    },
    'taxRate': {
      'name': '',
      'amount': 0.13,
      'includedInPrice': false,
      'country': 'CA',
      'subRates': [
        {
          'name': 'HST',
          'amount': 0.13
        }
      ]
    },
    'deliveries': [],
    'taxedPrice': {
      'totalNet': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'totalGross': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'totalTax': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      }
    },
    'shippingMethodState': 'MatchesCart'
  },
  'state': {
    'typeId': 'state',
    'id': '9f7bc955-f31f-4bdc-8b2d-1c6a823fc6ba'
  },
  'taxMode': 'ExternalAmount',
  'inventoryMode': 'None',
  'taxRoundingMode': 'HalfEven',
  'taxCalculationMode': 'LineItemLevel',
  'origin': 'Customer',
  'lineItems': [
    {
      'id': 'c17629d6-e028-4bc0-b655-5cee2fd0c96a',
      'productId': '9cae9b8f-8269-4b56-9a8c-4914e4a565b0',
      'productKey': '20081194075',
      'name': {
        'en-CA': 'Cotton-Blend Active T-Shirt',
        'fr-CA': 'T-shirt en mélange de coton'
      },
      'productType': {
        'typeId': 'product-type',
        'id': '2dc01154-c743-4d36-8d4a-71b1504bfe3b'
      },
      'productSlug': {
        'en-CA': '20081194075',
        'fr-CA': '20081194075'
      },
      'variant': {
        'id': 6,
        'sku': '-3600679',
        'prices': [
          {
            'id': '549299b4-b059-4aa2-bdaa-22f561b6d1df',
            'value': {
              'type': 'centPrecision',
              'currencyCode': 'CAD',
              'centAmount': 9000,
              'fractionDigits': 2
            },
            'country': 'CA',
            'custom': {
              'type': {
                'typeId': 'type',
                'id': '493275e3-23ad-492c-9ed1-7a174ad43182'
              },
              'fields': {
                'priceType': 'originalPrice'
              }
            }
          }
        ],
        'images': [
          {
            'url': 'https://i1.adis.ws/i/harryrosen/20081194075?$prp-4col-xl$',
            'dimensions': {
              'w': 242,
              'h': 288
            }
          }
        ],
        'attributes': [
          {
            'name': 'colorId',
            'value': '075'
          },
          {
            'name': 'skuLastModifiedInternal',
            'value': '2022-05-31T15:16:23.000Z'
          },
          {
            'name': 'size',
            'value': {
              'en-CA': 'XL',
              'fr-CA': 'TG'
            }
          },
          {
            'name': 'sizeId',
            'value': '181'
          },
          {
            'name': 'barcodes',
            'value': [
              {
                'typeId': 'key-value-document',
                'id': '451d691b-e6e7-4177-88fd-2eb775752a71'
              }
            ]
          },
          {
            'name': 'brandName',
            'value': {
              'en-CA': 'On',
              'fr-CA': 'On'
            }
          },
          {
            'name': 'construction',
            'value': {
              'en-CA': '<li> Crew neck\n',
              'fr-CA': '<li> Encolure ronde\n'
            }
          },
          {
            'name': 'fabricAndMaterials',
            'value': {
              'en-CA': '<li> 55% cotton, 37% vicose, 8% elastane\n<li> Dark grey',
              'fr-CA': '<li> 55 % coton, 37 % viscose, 8 % élasthanne\n<li> Gris foncé\n'
            }
          },
          {
            'name': 'styleAndMeasurements',
            'value': {
              'en-CA': '<li> Contemporary fit\n<li> Chest circumference: 36 in\n<li> Measurements based on M',
              'fr-CA': '<li> Coupe contemporaine\n<li> Tour de poitrine : 91,4 cm (36 po)\n<li> Mesure(s) prise(s) sur la taille M\n'
            }
          },
          {
            'name': 'careInstructions',
            'value': {
              'en-CA': '<li> Machine wash, cold\n<li> Do not bleach\n<li> Do not tumble dry\n<li> Iron, low',
              'fr-CA': '<li> Laver à la machine à l’eau froide\n<li> Ne pas javelliser\n<li> Ne pas sécher par culbutage\n<li> Repasser à basse température\n'
            }
          },
          {
            'name': 'advice',
            'value': {
              'en-CA': '',
              'fr-CA': ''
            }
          },
          {
            'name': 'colour',
            'value': {
              'en-CA': 'Black',
              'fr-CA': 'Noir'
            }
          },
          {
            'name': 'colourGroup',
            'value': {
              'en-CA': 'Black',
              'fr-CA': 'Noir'
            }
          },
          {
            'name': 'webStatus',
            'value': true
          },
          {
            'name': 'season',
            'value': 'SP-22'
          },
          {
            'name': 'originalPrice',
            'value': {
              'type': 'centPrecision',
              'currencyCode': 'CAD',
              'centAmount': 9000,
              'fractionDigits': 2
            }
          },
          {
            'name': 'vsn',
            'value': '122'
          },
          {
            'name': 'sizeChart',
            'value': 1
          },
          {
            'name': 'isEndlessAisle',
            'value': false
          },
          {
            'name': 'isReturnable',
            'value': true
          },
          {
            'name': 'relatedProductId',
            'value': '122355336On'
          },
          {
            'name': 'styleLastModifiedInternal',
            'value': '2022-06-13T16:09:46.000Z'
          },
          {
            'name': 'onSale',
            'value': false
          },
          {
            'name': 'isOutlet',
            'value': false
          },
          {
            'name': 'styleOutletLastModifiedInternal',
            'value': '2022-06-08T06:19:40.000Z'
          },
          {
            'name': 'hasOnlineAts',
            'value': true
          },
          {
            'name': 'brandId',
            'value': '1'
          },
          {
            'name': 'is997',
            'value': false
          }
        ],
        'assets': []
      },
      'price': {
        'id': '549299b4-b059-4aa2-bdaa-22f561b6d1df',
        'value': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 9000,
          'fractionDigits': 2
        },
        'country': 'CA',
        'custom': {
          'type': {
            'typeId': 'type',
            'id': '493275e3-23ad-492c-9ed1-7a174ad43182'
          },
          'fields': {
            'priceType': 'originalPrice'
          }
        }
      },
      'quantity': 1,
      'discountedPricePerQuantity': [],
      'taxRate': {
        'name': '',
        'amount': 0.13,
        'includedInPrice': false,
        'country': 'CA',
        'subRates': [
          {
            'name': 'HST',
            'amount': 0.13
          }
        ]
      },
      'addedAt': '2022-06-14T14:08:40.644Z',
      'lastModifiedAt': '2022-06-14T14:14:00.925Z',
      'state': [
        {
          'quantity': 1,
          'state': {
            'typeId': 'state',
            'id': 'bf63e3e1-9706-4006-80a9-f2b597091676'
          }
        }
      ],
      'priceMode': 'Platform',
      'totalPrice': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 9000,
        'fractionDigits': 2
      },
      'taxedPrice': {
        'totalNet': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 9000,
          'fractionDigits': 2
        },
        'totalGross': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 10170,
          'fractionDigits': 2
        },
        'totalTax': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 1170,
          'fractionDigits': 2
        }
      },
      'custom': {
        'type': {
          'typeId': 'type',
          'id': '71f02695-a9b5-4f17-97ff-ccf3c78b66f3'
        },
        'fields': {
          'itemTaxes': '{"HST":11.7}',
          'isGift': false,
          'size': 'XL',
          'orderDetailLastModifiedDate': '2022-06-14T19:42:02.000Z',
          'reasonCode': '',
          'lineNumber': 1,
          'category': 'T-Shirts',
          'unitPrice': {
            'type': 'centPrecision',
            'currencyCode': 'CAD',
            'centAmount': 9000,
            'fractionDigits': 2
          },
          'quantityCancelled': 0
        }
      },
      'lineItemMode': 'Standard',
      'shippingDetails': {
        'targets': [
          {
            'addressKey': '1e6e8b5f-3da8-4072-9170-ce4876e3fa24',
            'quantity': 1
          }
        ],
        'valid': true
      }
    }
  ],
  'customLineItems': [],
  'transactionFee': true,
  'discountCodes': [],
  'directDiscounts': [],
  'cart': {
    'typeId': 'cart',
    'id': '68983b59-a270-4464-9016-13d878de777a'
  },
  'custom': {
    'type': {
      'typeId': 'type',
      'id': '1666bac6-7c71-418d-9dbe-e3d15ab07c9a'
    },
    'fields': {
      'orderDate': '2022-06-14T14:14:00.000Z',
      'shipments': [
        {
          'typeId': 'key-value-document',
          'id': 'ef02f1f8-1a12-46ad-b81f-e8619f77612b'
        }
      ],
      'orderLastModifiedDate': '2022-06-14T19:42:02.000Z',
      'dynamicYieldData': {
        'typeId': 'key-value-document',
        'id': '266c2954-90c5-440e-891f-69a249852aa7'
      },
      'sentToDynamicYieldStatus': 'SUCCESS',
      'cartSourceSessionData': 'eyJzb3VyY2VXZWJzaXRlVXJsIjoid3d3LmhhcnJ5cm9zZW4uY29tIiwic291cmNlV2Vic2l0ZUxhbmciOiIvZW4iLCJjb29raWVzIjoibG9nZ2x5dHJhY2tpbmdzZXNzaW9uPTA5ZmNhOTE3LTc4MzUtNGZkOS1iMGQ2LWQ4NTI0YmM0MmVhYjsgYXNoX2F1dG9tYXRfYWk9eyUyMnVzZXJJZCUyMjolMjI0NTg2Y2ZmOC00Njk4LTQ1ZjEtODZkMC03NjRhM2E5NzFkYjclMjJ9OyBXQ1hVSUQ9NDU1Mjk5MDc3NDI5MTY0NDk3MDcwNDg7IF9BTEdPTElBPWFub255bW91cy0yZWIxMjdmYy1lMWExLTRhYzEtOTBmOC1kOGM1ODFlMDM5NjQ7IENvcmVJRDY9NjEyMjI2MDE4MTA1MTY0NDk3MDcwNzImY2k9NTQ5MzAwMDB8SFI7IHN5dGVfdXVpZD1mNjZhN2RhMC04ZWJkLTExZWMtODE1OS02YjE5Y2QyZTNkNzI7IF9waW5fdW5hdXRoPWRXbGtQVTFVYXpWT1YxVjRUVzFWZEZwRVZtbE5hVEF3V2tSVk1VeFVhR2hPVkd0MFRqSk5OVTVxYXpGUFJHczBXbFJTYkE7IF9nYT1HQTEuMi43MTUyNjA4ODIuMTY0NDk3MDcwODsgX19xY2E9UDAtOTcyMTEzMzkzLTE2NDQ5NzA3MDczMTM7IF9zY2lkPTg0NGMzZmUzLTgzMGQtNGU4My05NmM1LTM1NDQ4NTA1NjliZjsgY2pDb25zZW50PU1IeE9mREI4VG53dzsgY2pVc2VyPWViZTFkNjQ4LTk3MTAtNDJkNC1hYmRmLTk1ZGRiYTBjYjI5NDsgX2ZicD1mYi4wLjE2NDQ5NzA3MDg0MjMuNjQ2MTA1MjYxOyBleHRvbGVfYWNjZXNzX3Rva2VuPU9DN0o3UkdLRDVRTTRUOUI3TjlEMFBHSDdSOyBhYWlpZD03MjQwMzJjMi0xZWUwLTQzZjktODY5NC0yMzA5MWUyZGRmODM7IGh0Zz0wOkxlZ2FjeTsgX196bGNtaWQ9MThaa2kzdXRTNTlWOFp2OyBrdTEtdmlkPTcyMmM0M2E5LWE3ODItZWQwZi05N2M0LTAzZmI4ZjBkYTYzZjsgY3RvX2J1bmRsZT1hZW43RVY5MVNVNVVWWE5rWlVka1VXOU5TMWRYSlRKQ1RuRktPV0ZvVFhwUk4yTnFPWFpDVG1oR1dHOWFNQ1V5UWxkVVdrb2xNa1pYUzFwVldEZHhVV05pVDBWWEpUSkdjM2xFUTBKbGIwRlhVMWRsUm1sNUpUSkdhVXQxTTJwd1NVb2xNa1pFYTBoWVNERmxkMWRtY0ZWcGFqUlBkRGhpTjBKcVJWWjRVVWx1UkRJNGJUUkNSMHc1VWpCcVpXUWxNa1o1ZVNVeVFqbHFkWGhCYW1oRFYzTjRUbE5MU2tWRmRYaEJKVE5FSlRORTsgX2djbF9hdT0xLjEuMTg3MjkxNTY3Ni4xNjQ5MTkwMDcwOyBhanNfYW5vbnltb3VzX2lkPTU5NWI1OTRiLWZjMjMtNDNjNS1iZjIwLWU3ZGY0YmE4NzFhOTsgX2R5aWRfc2VydmVyPS01NzQ2NTkyOTI5NTk2MDA4OTAzOyBfZHlqc2Vzc2lvbj0zbTd3MjVqaWQ5anIzMmZ4MmQzcWxtcWljZWlxY2RpZDsgX2R5anNlc3Npb249M203dzI1amlkOWpyMzJmeDJkM3FsbXFpY2VpcWNkaWQ7IGR5X2ZzX3BhZ2U9d3d3LmhhcnJ5cm9zZW4uY29tJTJGZW4lMkZwcm9kdWN0JTJGb24tY290dG9uLWJsZW5kLWFjdGl2ZS10LXNoaXJ0LTIwMDgxMTk0MDc1JTNGY21fbW1jYTYlM0QlMjUzZGY2Y2U3NDM4ZDliNzA2M2FmYWEwNmY0YTI5YWU4OTczZGQxZGMxNDNhZTc3NGM1YmI5YTgyMzZlYjdiZTA0N2YlMjZ1dG1fY29udGVudCUzRHRpX2R0X2VuJTI2dXRtX2NhbXBhaWduJTNEc3MyMl9sb3dwcmljZWdpZnRzXzIwMjIwNjE0JTI2dXRtX21lZGl1bSUzRGVtYWlsJTI2dXRtX3NvdXJjZSUzRGFjb3VzdGljJTI2dXRtX2hpZCUzRGY2Y2U3NDM4ZDliNzA2M2FmYWEwNmY0YTI5YWU4OTczZGQxZGMxNDNhZTc3NGM1YmI5YTgyMzZlYjdiZTA0N2Y7IF9keV9jc2Nfc2VzPTNtN3cyNWppZDlqcjMyZngyZDNxbG1xaWNlaXFjZGlkOyBfZHlfY19leHBzPTsgX2R5X2NfYXR0X2V4cHM9OyBfZHlfc29jdD01NTM0MDkuMTA2NzU5OS4xNjU1MjE1Njc0KjYwNzM3OS4xMTcyNzQzLjE2NDQ5NzA3MDQucnRjemFzNW9jcDluMmN3OXQ3ZWkweWRvazdwbnhud2wqNjA3Mzc5LjExNzI3NDQuMTY1NTIxNTY3NC4zbTd3MjVqaWQ5anIzMmZ4MmQzcWxtcWljZWlxY2RpZDsgX2R5Y25zdD1kZzsgX2R5aWQ9LTU3NDY1OTI5Mjk1OTYwMDg5MDM7IF9keWNtYz0xOyBfZHljc3Q9ZC5hbi5jLnNzLmNkLjsgX2R5X2dlbz1DQS5OQS5DQV9PTi5DQV9PTl9Ub3JvbnRvOyBfZHlfZGZfZ2VvPUNhbmFkYS4uVG9yb250bzsgX2R5X3RvZmZzZXQ9LTE7IGFhaW1idjI9eyUyMmxhc3ROb3RpZmllZCUyMjowJTJDJTIyc3VwcHJlc3MlMjI6ZmFsc2V9OyBhYWlqNHU9eyUyMm5hbWUlMjI6JTIyJTIyfTsgV0NYU0lEPTAwMDA2MzYwNTQ4MTY1NTIxNTY3NjY0NDU0OTMwMDAwOyBocl90b2tlbl9leHBpcnk9MjAyMi0wNi0xNFQxNyUzQTA3JTNBNTYuNDcwWjsgc2EtdXNlci1pZD1zJTI1M0EwLTMxODU2MjE2LTBlOWEtNGFlMi01NmVjLWIzYTRlMzNiODcwNS5DeTY4UG9aWno3bFY2N29NJTI1MkZMOXJ1dkRkMXZOM0VnejZOd1RyeWdsd0hOMDsgc2EtdXNlci1pZC12Mj1zJTI1M0EwLTMxODU2MjE2LTBlOWEtNGFlMi01NmVjLWIzYTRlMzNiODcwNSUyNTI0Y2VsbC4xR3A4aTV0YiUyNTJGV2dQQTJCU1VMMk8yYUJQanhyJTI1MkZiUmhLa3JVZjdFSVZGaVk7IHN0aW1ncz17JTIyc2Vzc2lvbklkJTIyOjcyNDgyNzEyJTJDJTIyZGlkUmVwb3J0Q2FtZXJhSW1wcmVzc2lvbiUyMjpmYWxzZSUyQyUyMm5ld1VzZXIlMjI6ZmFsc2V9OyBjbVRQU2V0PVk7IDU0OTMwMDAwfEhSX2Nsb2dpbj1sPTYzNjA1NDgxNjU1MjE1Njc2NjQ0JnY9MyZlPTE2NTUyMTc0NzgyMzc7IF9naWQ9R0ExLjIuMTgxMDMzNDk3NC4xNjU1MjE1NjgwOyBnaXNjYWxsdXNlcnV1aWQ9MWoxem1zazMtcDh2ci12a2t4LWRsMjItejZpN2pmdDF0Z3c2OyBQRVJTT05JRlk9MTY1NTIxNTY4MDY5Ni0yMTEwODc2Ni03ZjMyLWE1Y2ItNTExNy0yYjAwMDAyZDk1YWQ7IHBlcnNvbmFsaXNhdGlvbl9zZXNzaW9uX3NrdXNfbHM9eyUyMjcyNDgyNzEyJTIyOlslMjIyMDA4MTE5NDA3NSUyMl19OyBhdXRvbWF0LXBvcHVwPXslMjJ0aW1lc1NlZW4lMjI6MCUyQyUyMnRpbWVMZWZ0JTIyOm51bGx9OyBhYWlzPWRlYzNhMDZkLWFhMTEtNDE4MC04Nzc2LWJlNDk2NTAwZTYzODsgX3NjdHI9MXwxNjU1MTc5MjAwMDAwOyBrdTEtc2lkPXdYdXpoM1JNRGZLNEtxR1owUUlFYjsgX3R0X2VuYWJsZV9jb29raWU9MTsgX3R0cD03OTJmZTRhZi1mNWQyLTRlZmEtOTE0MS04NDdkMjY0ZGQ3MmU7IGNPYl89OWNhZTliOGYtODI2OS00YjU2LTlhOGMtNDkxNGU0YTU2NWIwX182LV8tMjAwODExOTQwNzUtXy1Db3R0b24tQmxlbmQgQWN0aXZlIFQtU2hpcnQtXy1ULVNoaXJ0cy1fLUJsYWNrLV8tT24tXy1YTC1fLTkwOyBtYXRjaGJveD17XCJtYXRjaGJveFwiOmZhbHNlLFwic2t1c1wiOltcIjIwMDgxMTk0MDc1XCIsXCJcIl19OyBfZGRfcz1sb2dzPTEmaWQ9ZGIyMmYwMjAtN2YxNS00NzJjLWE4ZjYtMzlmOWRkZDJhMTI4JmNyZWF0ZWQ9MTY1NTIxNTY3NjI0MCZleHBpcmU9MTY1NTIxNjY2NDQwNSZydW09MTsgV0NYU0lEX2V4cGlyeT0xNjU1MjE1NzY0NTE4IiwiY29va2llRG9tYWluc0hhbmRsZWQiOnRydWV9',
      'narvarLastSuccessTime': '2022-06-14T19:42:35.685Z',
      'sentToCrmStatus': 'SUCCESS',
      'sentToOmsStatus': 'SUCCESS',
      'cartClaimed': true,
      'payment_gateway_shipping_method': 'lowcost',
      'narvarStatus': 'SUCCESS',
      'shippingTax2': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'cartSourceWebsite': '00990',
      'shippingTax1': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'shippingTaxes': '{"HST":0}',
      'orderCreatedDate': '2022-06-14T14:15:03.000Z',
      'loginRadiusUid': '547cac7c80c3409b82582d1e47ce84fd'
    }
  },
  'paymentInfo': {
    'payments': [
      {
        'typeId': 'payment',
        'id': 'fd5c68e1-960f-4a0d-969b-50ccb1c70022',
        'obj': {
          'id': 'fd5c68e1-960f-4a0d-969b-50ccb1c70022',
          'version': 5,
          'lastMessageSequenceNumber': 2,
          'createdAt': '2022-06-14T14:14:00.753Z',
          'lastModifiedAt': '2022-06-14T14:14:05.301Z',
          'lastModifiedBy': {
            'clientId': 'Q7Ct9f3B8iSG-DCGSOj3uk_8',
            'isPlatformClient': false
          },
          'createdBy': {
            'clientId': 'Q7Ct9f3B8iSG-DCGSOj3uk_8',
            'isPlatformClient': false
          },
          'amountPlanned': {
            'type': 'centPrecision',
            'currencyCode': 'CAD',
            'centAmount': 10170,
            'fractionDigits': 2
          },
          'paymentMethodInfo': {
            'paymentInterface': 'paypal_paypal',
            'method': 'paypal',
            'name': {
              'en': 'Paypal : paypal_paypal'
            }
          },
          'custom': {
            'type': {
              'typeId': 'type',
              'id': '3d81c9ea-bb2e-47d3-9a80-07a37fa7dd96'
            },
            'fields': {
              'transaction_card_last4': 'd.ogilvie91@yahoo.com',
              'transaction_card_expiry': '',
              'user_agent_string': 'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G950W) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/17.0 Chrome/96.0.4664.104 Mobile Safari/537.36',
              'avs_result': '',
              'auth_number': '',
              'user_ip_address': '209.171.88.160',
              'transaction_card_type': 'paypal',
              'transaction_time': '141358',
              'bin': '',
              'transaction_date': '20220614'
            }
          },
          'paymentStatus': {
            'interfaceCode': 'paid',
            'interfaceText': 'paid'
          },
          'transactions': [
            {
              'id': '4192e46c-827c-4d93-b291-b2ba823325db',
              'timestamp': '2022-06-14T14:14:04.000Z',
              'type': 'Charge',
              'amount': {
                'type': 'centPrecision',
                'currencyCode': 'CAD',
                'centAmount': 10170,
                'fractionDigits': 2
              },
              'interactionId': '3CV89920AH497733P:RLM9MTKA235ME',
              'state': 'Success'
            }
          ],
          'interfaceInteractions': []
        }
      }
    ]
  },
  'shippingAddress': {
    'firstName': 'David',
    'lastName': 'Ogilvie',
    'streetName': '156 Portland Street,  Suite 420',
    'postalCode': 'M5V 0G1',
    'city': 'Toronto',
    'state': 'ON',
    'country': 'CA',
    'phone': '4163024251',
    'email': 'd.ogilvie91@yahoo.com',
    'key': '1e6e8b5f-3da8-4072-9170-ce4876e3fa24'
  },
  'billingAddress': {
    'firstName': 'David',
    'lastName': 'Ogilvie',
    'streetName': '156 Portland Street',
    'postalCode': 'M5V 0G1',
    'city': 'Toronto',
    'state': 'ON',
    'country': 'CA',
    'phone': '4163024251',
    'email': 'd.ogilvie91@yahoo.com',
    'additionalAddressInfo': 'Suite 420'
  },
  'itemShippingAddresses': [
    {
      'firstName': 'David',
      'lastName': 'Ogilvie',
      'streetName': '156 Portland Street,  Suite 420',
      'postalCode': 'M5V 0G1',
      'city': 'Toronto',
      'state': 'ON',
      'country': 'CA',
      'phone': '4163024251',
      'email': 'd.ogilvie91@yahoo.com',
      'key': '1e6e8b5f-3da8-4072-9170-ce4876e3fa24'
    }
  ],
  'refusedGifts': []
}


const pluginPayment = {
  'type': 'Order',
  'id': 'c0692f28-a450-4a88-95fd-ec811304ee6d',
  'version': 112,
  'lastMessageSequenceNumber': 13,
  'createdAt': '2022-06-14T12:59:59.209Z',
  'lastModifiedAt': '2022-06-14T15:52:05.962Z',
  'lastModifiedBy': {
    'clientId': 'zYxXiV2BA7lsH-NwacYsONon',
    'isPlatformClient': false
  },
  'createdBy': {
    'clientId': 'Q7Ct9f3B8iSG-DCGSOj3uk_8',
    'isPlatformClient': false
  },
  'orderNumber': '67666272',
  'customerId': '25fb581b-c518-454a-b6e1-f8b079f4c756',
  'customerEmail': 'jcatanan@hotmail.com',
  'customerGroup': {
    'typeId': 'customer-group',
    'id': 'ad6c3a6c-cbc6-4dc3-a7b8-7288b8f8a9cd'
  },
  'anonymousId': '7c4680ae-350e-4da3-9140-4d56936dc613',
  'locale': 'en-CA',
  'totalPrice': {
    'type': 'centPrecision',
    'currencyCode': 'CAD',
    'centAmount': 13800,
    'fractionDigits': 2
  },
  'taxedPrice': {
    'totalNet': {
      'type': 'centPrecision',
      'currencyCode': 'CAD',
      'centAmount': 13800,
      'fractionDigits': 2
    },
    'totalGross': {
      'type': 'centPrecision',
      'currencyCode': 'CAD',
      'centAmount': 15594,
      'fractionDigits': 2
    },
    'taxPortions': [
      {
        'rate': 0.13,
        'amount': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 1794,
          'fractionDigits': 2
        },
        'name': 'HST'
      }
    ],
    'totalTax': {
      'type': 'centPrecision',
      'currencyCode': 'CAD',
      'centAmount': 1794,
      'fractionDigits': 2
    }
  },
  'country': 'CA',
  'orderState': 'Confirmed',
  'shipmentState': 'Pending',
  'paymentState': 'Paid',
  'syncInfo': [],
  'returnInfo': [],
  'shippingInfo': {
    'shippingMethodName': 'Standard',
    'price': {
      'type': 'centPrecision',
      'currencyCode': 'CAD',
      'centAmount': 0,
      'fractionDigits': 2
    },
    'shippingRate': {
      'price': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'tiers': []
    },
    'taxRate': {
      'name': '',
      'amount': 0.13,
      'includedInPrice': false,
      'country': 'CA',
      'subRates': [
        {
          'name': 'HST',
          'amount': 0.13
        }
      ]
    },
    'deliveries': [],
    'taxedPrice': {
      'totalNet': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'totalGross': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'totalTax': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      }
    },
    'shippingMethodState': 'MatchesCart'
  },
  'state': {
    'typeId': 'state',
    'id': '9f7bc955-f31f-4bdc-8b2d-1c6a823fc6ba'
  },
  'taxMode': 'ExternalAmount',
  'inventoryMode': 'None',
  'taxRoundingMode': 'HalfEven',
  'taxCalculationMode': 'LineItemLevel',
  'origin': 'Customer',
  'lineItems': [
    {
      'id': '464fb853-7444-4ce5-b595-aa32e9fbc5a1',
      'productId': '5a2b95cf-9977-4306-8307-1bd73077b07d',
      'productKey': '20083925075',
      'name': {
        'en-CA': 'Signature Leather Cardholder',
        'fr-CA': 'Porte-carte en cuir'
      },
      'productType': {
        'typeId': 'product-type',
        'id': '2dc01154-c743-4d36-8d4a-71b1504bfe3b'
      },
      'productSlug': {
        'en-CA': '20083925075',
        'fr-CA': '20083925075'
      },
      'variant': {
        'id': 2,
        'sku': '-3646775',
        'prices': [
          {
            'id': 'dba62085-8da5-4f5f-b10f-aa7f3257c361',
            'value': {
              'type': 'centPrecision',
              'currencyCode': 'CAD',
              'centAmount': 13800,
              'fractionDigits': 2
            },
            'country': 'CA',
            'custom': {
              'type': {
                'typeId': 'type',
                'id': '493275e3-23ad-492c-9ed1-7a174ad43182'
              },
              'fields': {
                'priceType': 'originalPrice'
              }
            }
          }
        ],
        'images': [
          {
            'url': 'https://i1.adis.ws/i/harryrosen/20083925075?$prp-4col-xl$',
            'dimensions': {
              'w': 242,
              'h': 288
            }
          }
        ],
        'attributes': [
          {
            'name': 'colorId',
            'value': '075'
          },
          {
            'name': 'skuLastModifiedInternal',
            'value': '2022-01-31T20:16:40.000Z'
          },
          {
            'name': 'size',
            'value': {
              'en-CA': 'One Size',
              'fr-CA': 'Taille unique'
            }
          },
          {
            'name': 'sizeId',
            'value': '179'
          },
          {
            'name': 'barcodes',
            'value': [
              {
                'typeId': 'key-value-document',
                'id': 'd051fb0a-848c-4b41-8da7-942963c6f1ed'
              }
            ]
          },
          {
            'name': 'brandName',
            'value': {
              'en-CA': 'BOSS',
              'fr-CA': 'BOSS'
            }
          },
          {
            'name': 'construction',
            'value': {
              'en-CA': '<li> Six card slots\n<li> Two receipt pockets\n<li> Centre coin pouch',
              'fr-CA': '<li> Six pochettes pour carte\n<li> Deux compartiments pour les reçus\n<li> Pochette centrale pour la monnaie'
            }
          },
          {
            'name': 'fabricAndMaterials',
            'value': {
              'en-CA': '<li> Leather\n<li> Black',
              'fr-CA': '<li> Cuir\n<li> Noir'
            }
          },
          {
            'name': 'styleAndMeasurements',
            'value': {
              'en-CA': '<li> Height: 3.25 in\n<li> Width: 4.5 in',
              'fr-CA': '<li> Hauteur : 8,3 cm (3,25 po)\n<li> Largeur : 11,4 cm (4,5 po)'
            }
          },
          {
            'name': 'careInstructions',
            'value': {
              'en-CA': '',
              'fr-CA': ''
            }
          },
          {
            'name': 'advice',
            'value': {
              'en-CA': '',
              'fr-CA': ''
            }
          },
          {
            'name': 'colour',
            'value': {
              'en-CA': 'Black',
              'fr-CA': 'Noir'
            }
          },
          {
            'name': 'colourGroup',
            'value': {
              'en-CA': 'Black',
              'fr-CA': 'Noir'
            }
          },
          {
            'name': 'webStatus',
            'value': true
          },
          {
            'name': 'season',
            'value': 'SP-22'
          },
          {
            'name': 'originalPrice',
            'value': {
              'type': 'centPrecision',
              'currencyCode': 'CAD',
              'centAmount': 13800,
              'fractionDigits': 2
            }
          },
          {
            'name': 'vsn',
            'value': '50465508'
          },
          {
            'name': 'sizeChart',
            'value': 0
          },
          {
            'name': 'isEndlessAisle',
            'value': false
          },
          {
            'name': 'isReturnable',
            'value': true
          },
          {
            'name': 'relatedProductId',
            'value': '50465508700571BOSS'
          },
          {
            'name': 'styleLastModifiedInternal',
            'value': '2022-06-13T16:30:58.000Z'
          },
          {
            'name': 'onSale',
            'value': false
          },
          {
            'name': 'brandId',
            'value': '1'
          },
          {
            'name': 'isOutlet',
            'value': false
          },
          {
            'name': 'is997',
            'value': false
          },
          {
            'name': 'styleOutletLastModifiedInternal',
            'value': '2022-06-13T06:21:49.000Z'
          },
          {
            'name': 'hasOnlineAts',
            'value': true
          }
        ],
        'assets': []
      },
      'price': {
        'id': 'dba62085-8da5-4f5f-b10f-aa7f3257c361',
        'value': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 13800,
          'fractionDigits': 2
        },
        'country': 'CA',
        'custom': {
          'type': {
            'typeId': 'type',
            'id': '493275e3-23ad-492c-9ed1-7a174ad43182'
          },
          'fields': {
            'priceType': 'originalPrice'
          }
        }
      },
      'quantity': 1,
      'discountedPricePerQuantity': [],
      'taxRate': {
        'name': '',
        'amount': 0.13,
        'includedInPrice': false,
        'country': 'CA',
        'subRates': [
          {
            'name': 'HST',
            'amount': 0.13
          }
        ]
      },
      'addedAt': '2022-06-14T12:55:16.183Z',
      'lastModifiedAt': '2022-06-14T12:59:59.065Z',
      'state': [
        {
          'quantity': 1,
          'state': {
            'typeId': 'state',
            'id': 'bf63e3e1-9706-4006-80a9-f2b597091676'
          }
        }
      ],
      'priceMode': 'Platform',
      'totalPrice': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 13800,
        'fractionDigits': 2
      },
      'taxedPrice': {
        'totalNet': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 13800,
          'fractionDigits': 2
        },
        'totalGross': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 15594,
          'fractionDigits': 2
        },
        'totalTax': {
          'type': 'centPrecision',
          'currencyCode': 'CAD',
          'centAmount': 1794,
          'fractionDigits': 2
        }
      },
      'custom': {
        'type': {
          'typeId': 'type',
          'id': '71f02695-a9b5-4f17-97ff-ccf3c78b66f3'
        },
        'fields': {
          'itemTaxes': '{"HST":17.94}',
          'isGift': false,
          'size': 'O/S',
          'orderDetailLastModifiedDate': '2022-06-14T15:51:04.000Z',
          'reasonCode': '',
          'lineNumber': 1,
          'category': 'Wallets',
          'unitPrice': {
            'type': 'centPrecision',
            'currencyCode': 'CAD',
            'centAmount': 13800,
            'fractionDigits': 2
          },
          'quantityCancelled': 0,
          'algoliaAnalyticsData': {
            'typeId': 'key-value-document',
            'id': '25348dce-9a58-40bb-9fa6-daadf5cf2834'
          }
        }
      },
      'lineItemMode': 'Standard',
      'shippingDetails': {
        'targets': [
          {
            'addressKey': '57e290e1-74b0-41dc-be01-71c115c4fc31',
            'quantity': 1
          }
        ],
        'valid': true
      }
    }
  ],
  'customLineItems': [],
  'transactionFee': true,
  'discountCodes': [],
  'directDiscounts': [],
  'cart': {
    'typeId': 'cart',
    'id': '11a61892-f32f-4cff-8409-dae767bafa18'
  },
  'custom': {
    'type': {
      'typeId': 'type',
      'id': '1666bac6-7c71-418d-9dbe-e3d15ab07c9a'
    },
    'fields': {
      'orderDate': '2022-06-14T12:59:00.000Z',
      'shipments': [
        {
          'typeId': 'key-value-document',
          'id': '769dc1ab-6d5b-447d-afbf-ea79e3632990'
        }
      ],
      'orderLastModifiedDate': '2022-06-14T15:51:04.000Z',
      'sentToAlgoliaStatus': 'SUCCESS',
      'sentToDynamicYieldStatus': 'SUCCESS',
      'cartSourceSessionData': 'eyJzb3VyY2VXZWJzaXRlVXJsIjoid3d3LmhhcnJ5cm9zZW4uY29tIiwic291cmNlV2Vic2l0ZUxhbmciOiIvZW4iLCJjb29raWVzIjoibG9nZ2x5dHJhY2tpbmdzZXNzaW9uPTI0YTc1ODRmLTAyMjgtNGJhNi04OGEwLTVlY2I3YjA1OTllZjsgX2R5aWRfc2VydmVyPS02NTc1MjU1MjU2NzM3MjE3NzUzOyBfZHlqc2Vzc2lvbj1kMzV2ZnZucXQ0Nmdtc3JnenR3Zm8wYmRiZzFkbHI3YTsgX2R5anNlc3Npb249ZDM1dmZ2bnF0NDZnbXNyZ3p0d2ZvMGJkYmcxZGxyN2E7IGR5X2ZzX3BhZ2U9d3d3LmhhcnJ5cm9zZW4uY29tJTJGZW47IF9keV9jc2Nfc2VzPWQzNXZmdm5xdDQ2Z21zcmd6dHdmbzBiZGJnMWRscjdhOyBhc2hfYXV0b21hdF9haT17JTIydXNlcklkJTIyOiUyMmQyZmZkZjVkLTg4NGEtNGI2Yi1iZWEwLWVkYzE5ZWMzOTYyNyUyMn07IF9keV9jX2V4cHM9OyBfZ2NsX2F1PTEuMS4xNTI1NjAyMjg2LjE2NTUyMTA3OTM7IFdDWFVJRD0zOTc0ODE2MTAwOTgxNjU1MjEwNzkzNjsgV0NYU0lEPTAwMDAyNDMyNTA3MTY1NTIxMDc5MzYwNDU0OTMwMDAwOyBhYWltYnYyPXslMjJsYXN0Tm90aWZpZWQlMjI6MCUyQyUyMnN1cHByZXNzJTIyOmZhbHNlfTsgYWFpajR1PXslMjJuYW1lJTIyOiUyMiUyMn07IF9nYT1HQTEuMi4xODYxNjgyNjY0LjE2NTUyMTA3OTQ7IF9naWQ9R0ExLjIuNzYxMDQ0NjEzLjE2NTUyMTA3OTQ7IGF1dG9tYXQtcG9wdXA9eyUyMnRpbWVzU2VlbiUyMjowJTJDJTIydGltZUxlZnQlMjI6bnVsbH07IGFhaWlkPTBiYzFkMGFiLTU5MGMtNDM3ZS04ODk0LTVhODU2ZmUwYmMxODsgYWFpcz02MzNhYWEyZi03NzE2LTQyNjMtODcwYy05ODc5ZDI5NTZmYTQ7IGh0Zz0wOkxlZ2FjeTsgYWpzX2Fub255bW91c19pZD02ZjBiZmYyNC05M2ZiLTQ1MDMtYTFhZi0wODUyZmE1ZWY5NmY7IF9zY2lkPTVjM2U4Y2ZkLTEzN2EtNGQzZC05ODBjLWRmM2FlOTNiOGQ4ZTsgc2EtdXNlci1pZD1zJTI1M0EwLWYzYWFiZmExLThhZDQtNDllZi02N2NlLTA0MzQ2MmRlMDZjNC5HVHpkaFJ0anBhallKaWkwWVNCS0sweVVVT2tEVGtsQUR2YnY5anBZRFpzOyBzYS11c2VyLWlkLXYyPXMlMjUzQTAtN2IyZDMyY2EtY2E3Yy00OTgyLTViOWYtOWM3Y2U3MDQ2ZjAyJTI1MjRpcCUyNTI0MTk5LjE2Ni4xMC43MS5FN0ZDdUFHY25IcGliVXBiRHg4Mk1aT0pSdDFUeU1jT3ZXbnowaFNwM0I4OyBzeXRlX3V1aWQ9MDVmOGI1ZjAtZWJlMC0xMWVjLThmM2QtMzdlMzQ0YWZjMjgzOyBzdGltZ3M9eyUyMnNlc3Npb25JZCUyMjo0MDIxNzU5MyUyQyUyMmRpZFJlcG9ydENhbWVyYUltcHJlc3Npb24lMjI6ZmFsc2UlMkMlMjJuZXdVc2VyJTIyOnRydWV9OyBjbVRQU2V0PVk7IENvcmVJRDY9NjY1OTQ0NDA0NjY2MTY1NTIxMDc5NDkmY2k9NTQ5MzAwMDB8SFI7IGhyX3Rva2VuX2V4cGlyeT0yMDIyLTA2LTE0VDE1JTNBNDYlM0EzNC44MDBaOyBleHRvbGVfYWNjZXNzX3Rva2VuPUVNMTFOU1IzN0w5VU9JUUJSVjIzTElOQ1M2OyBfcGluX3VuYXV0aD1kV2xrUFU5RVNYaGFSRXBvV20xVmRGcHRUVEpPZVRBd1drUm5OVXhVWjNwT1JFMTBXV3BuZUU1NlJtdE5la0YzVFVkTk5BOyBjalVzZXI9ZWIwMjk4NWQtZWI0OS00MWI2LWFjMWUtMDE5N2IzMWM2ZDUxOyBfZmJwPWZiLjAuMTY1NTIxMDc5NTc0Ni4xMjEzMTMyNjA2OyBQRVJTT05JRlk9MTY1NTIxMDc5NTg5Ny1mYTg0MDE0Ny04MTgzLWZlYjItOGYzZS0xZDQyMTg1MWE3NzY7IF9fcWNhPVAwLTE5MzY5MzUyOTgtMTY1NTIxMDc5NTQwNzsgNTQ5MzAwMDB8SFJfY2xvZ2luPXY9NyZsPTI0MzI1MDcxNjU1MjEwNzkzNjA0JmU9MTY1NTIxMjU5OTA0MzsgX196bGNtaWQ9MUFUbDA1ZlN0bGZxTGhPOyBzeXRlX2FiX3Rlc3RzPXt9OyBfZHlfY19hdHRfZXhwcz07IF9BTEdPTElBPWFub255bW91cy02Y2I2ZWQ2Zi02MWRiLTQ4ZGMtOTg4YS1iMDk3NmRmM2Y0Njk7IF90dF9lbmFibGVfY29va2llPTE7IF90dHA9ZmIyMTdkNDgtNjIxMy00NDNjLTk2NjYtNzg1MDc4ZGFkNDdjOyBrdTEtc2lkPVphRlFWbHpHT2w2VFJhLWg4Nkl4ejsga3UxLXZpZD04Mjc1YTE2Mi0wYTgzLTM1YzQtYzI1NC1iZmQ2NzA1NWNlMjk7IGdpc2NhbGx1c2VydXVpZD1sOXZnbWJmMC00OXVyLThlcTAtNzhoMS1lNzc0cW81eHhzbjg7IF9keWNuc3Q9ZGc7IF9keWlkPS02NTc1MjU1MjU2NzM3MjE3NzUzOyBfZHlmcz0xNjU1MjEwODg1MDk3OyBfZHljc3Q9ZGsudy5jLndzLjsgX2R5X2dlbz1DQS5OQS5DQV9PTi5DQV9PTl9Ub3JvbnRvOyBfZHlfZGZfZ2VvPUNhbmFkYS4uVG9yb250bzsgX2R5X3RvZmZzZXQ9LTI7IGNqZT1kODI1ODRiMWViZTAxMWVjODE5MDZjZDMwYTgyYjgyYzsgX2R5X3NvY3Q9NTUzNDA5LjEwNjc1OTkuMTY1NTIxMTE0OSo2MDczNzkuMTE3Mjc0My4xNjU1MjEwNzkyLmQzNXZmdm5xdDQ2Z21zcmd6dHdmbzBiZGJnMWRscjdhOyBjdG9fYnVuZGxlPTJwSk9QVjlIVUhsaVVuRnJjblU0UzBOQlZWRm5lakJXY0c5VEpUSkNWV0poVkhaeFJDVXlRa2w1V0VONGRWVWxNa0pPZVZkc1pYWnZNMDgzYUVreVNVRmFiME5uWjBoeVptWnZWazE1WXpSMU5HRjBORGxHZHpWWWJHSkJlR1JEUjFadE5IaFNkRGN4YVVkMllUQXljVTlLTURCWVVYZDZhMHMwV0VsVlIwTTRjV3hVZW5KRk1qWnZkbkJoV1Uxc1QzQlhUMHBZYVZOTmRrODFSakUxZFdjbE0wUWxNMFE7IF9kZXJpdmVkX2VwaWs9ZGoweUpuVTlWa1k0VFdkUk5qTlRNa0oxTFVzMlNFNWZVa1ZvVG10MFUzUnFabVZZTTFNbWJqMXNNemhaT1hsRVNraGxlWFJEVUVKUFNrMVplbkJCSm0wOU1TWjBQVUZCUVVGQlIwdHZhRXBSSm5KdFBURW1jblE5UVVGQlFVRkhTMjlvU2xFOyBjakNvbnNlbnQ9TVh4T2ZEQjhXWHd3OyBjamV2ZW50X2RjPWQ4MjVkZmJmZWJlMDExZWM4MjUyMDBhNzBhODJiODIwOyBjT2JfPTVhMmI5NWNmLTk5NzctNDMwNi04MzA3LTFiZDczMDc3YjA3ZF9fMi1fLTIwMDgzOTI1MDc1LV8tU2lnbmF0dXJlIExlYXRoZXIgQ2FyZGhvbGRlci1fLVdhbGxldHMtXy1CbGFjay1fLUJPU1MtXy1PbmUgU2l6ZS1fLTEzODsgcGVyc29uYWxpc2F0aW9uX3Nlc3Npb25fc2t1c19scz17JTIyNDAyMTc1OTMlMjI6WyUyMjIwMDY5ODAxMTcwJTIyJTJDJTIyMjAwNzk1NzMxNTAlMjIlMkMlMjIyMDA4MzkyNTA3NSUyMiUyQyUyMjIwMDc5Njk0MDE1JTIyJTJDJTIyMjAwNzk2OTMwMjAlMjIlMkMlMjIyMDA4NDYwODA2MSUyMl19OyBtYXRjaGJveD17XCJtYXRjaGJveFwiOmZhbHNlLFwic2t1c1wiOltcIjIwMDY5ODAxMTcwXCIsXCIyMDA4MzkyNTA3NVwiLFwiXCJdfTsgX2RkX3M9bG9ncz0xJmlkPWZiOTA0NThlLThjODUtNGUzYy1hOTEwLTQ1MDEwZDA1ZTRkNyZjcmVhdGVkPTE2NTUyMTA4MDAwNzImZXhwaXJlPTE2NTUyMTIzNjI1MTEmcnVtPTE7IFdDWFNJRF9leHBpcnk9MTY1NTIxMTQ2MzcyMCIsImNvb2tpZURvbWFpbnNIYW5kbGVkIjp0cnVlfQ==',
      'narvarLastSuccessTime': '2022-06-14T15:52:01.857Z',
      'sentToCrmStatus': 'SUCCESS',
      'sentToOmsStatus': 'SUCCESS',
      'cartClaimed': true,
      'payment_gateway_shipping_method': 'lowcost',
      'narvarStatus': 'SUCCESS',
      'shippingTax2': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'cartSourceWebsite': '00990',
      'cjEvent': 'd82584b1ebe011ec81906cd30a82b82c',
      'dynamicYieldData': {
        'typeId': 'key-value-document',
        'id': 'e855d8f3-0f8c-4aa0-a745-00c68b5e1f47'
      },
      'shippingTax1': {
        'type': 'centPrecision',
        'currencyCode': 'CAD',
        'centAmount': 0,
        'fractionDigits': 2
      },
      'shippingTaxes': '{"HST":0}',
      'orderCreatedDate': '2022-06-14T13:01:02.000Z',
      'loginRadiusUid': 'e932020f69594a1098a923efcd164b00'
    }
  },
  'paymentInfo': {
    'payments': [
      {
        'typeId': 'payment',
        'id': '3fbb7883-c028-4cc1-bfc7-6439e98d51e3',
        'obj': {
          'id': '3fbb7883-c028-4cc1-bfc7-6439e98d51e3',
          'version': 5,
          'lastMessageSequenceNumber': 2,
          'createdAt': '2022-06-14T12:59:58.929Z',
          'lastModifiedAt': '2022-06-14T13:00:01.337Z',
          'lastModifiedBy': {
            'clientId': 'Q7Ct9f3B8iSG-DCGSOj3uk_8',
            'isPlatformClient': false
          },
          'createdBy': {
            'clientId': 'Q7Ct9f3B8iSG-DCGSOj3uk_8',
            'isPlatformClient': false
          },
          'amountPlanned': {
            'type': 'centPrecision',
            'currencyCode': 'CAD',
            'centAmount': 15594,
            'fractionDigits': 2
          },
          'paymentMethodInfo': {
            'paymentInterface': 'plugin_v2',
            'method': 'plugin',
            'name': {
              'en': 'plugin_v2'
            }
          },
          'custom': {
            'type': {
              'typeId': 'type',
              'id': '3d81c9ea-bb2e-47d3-9a80-07a37fa7dd96'
            },
            'fields': {
              'transaction_card_last4': 'Klarna',
              'transaction_card_expiry': '',
              'user_agent_string': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
              'avs_result': 'N/A',
              'auth_number': '',
              'user_ip_address': '199.166.10.74',
              'transaction_card_type': 'klarna',
              'transaction_time': '125956',
              'bin': 'N/A',
              'transaction_date': '20220614'
            }
          },
          'paymentStatus': {
            'interfaceCode': 'paid',
            'interfaceText': 'paid'
          },
          'transactions': [
            {
              'id': 'aeb09dd4-2120-4db6-b7cd-71e4bd59a538',
              'timestamp': '2022-06-14T13:00:00.000Z',
              'type': 'Charge',
              'amount': {
                'type': 'centPrecision',
                'currencyCode': 'CAD',
                'centAmount': 15594,
                'fractionDigits': 2
              },
              'interactionId': 'c71ce984-464c-4b17-a676-e5234d2eaec8',
              'state': 'Success'
            }
          ],
          'interfaceInteractions': []
        }
      }
    ]
  },
  'shippingAddress': {
    'firstName': 'Joanna',
    'lastName': 'Catanan',
    'streetName': '8 Jade Crescent',
    'postalCode': 'L4L 6L6',
    'city': 'Vaughan',
    'state': 'ON',
    'country': 'CA',
    'phone': '6479980520',
    'email': 'jcatanan@hotmail.com',
    'key': '57e290e1-74b0-41dc-be01-71c115c4fc31'
  },
  'billingAddress': {
    'firstName': 'Joanna',
    'lastName': 'Catanan',
    'streetName': '8 Jade Crescent',
    'postalCode': 'L4L 6L6',
    'city': 'Vaughan',
    'state': 'ON',
    'country': 'CA',
    'phone': '6479980520',
    'email': 'jcatanan@hotmail.com'
  },
  'itemShippingAddresses': [
    {
      'firstName': 'Joanna',
      'lastName': 'Catanan',
      'streetName': '8 Jade Crescent',
      'postalCode': 'L4L 6L6',
      'city': 'Vaughan',
      'state': 'ON',
      'country': 'CA',
      'phone': '6479980520',
      'email': 'jcatanan@hotmail.com',
      'key': '57e290e1-74b0-41dc-be01-71c115c4fc31'
    }
  ],
  'refusedGifts': []
}

module.exports = { payPalPayment, pluginPayment }

