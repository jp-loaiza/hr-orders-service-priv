const mockRequestBuilder = {
  orders: {
    where: () => mockRequestBuilder.orders,
    expand: () => mockRequestBuilder.orders,
    byId: (id) => {
      if (id) {
        return {
          expand: () => ({
            expand: () => ({
              expand: () => ({
                expand: () => ({
                  expand: () => ({
                    expand: () => ({
                      expand: () => ({
                        build: () => id
                      })
                    })
                  })
                })
              })
            })
          })
        }
      }
      return mockRequestBuilder.orders
    },
    build: () => mockRequestBuilder.orders
  },
  products: {
    byKey: () => mockRequestBuilder.products,
    build: () => mockRequestBuilder.products
  },
  customObjects: {
    byKey: () => mockRequestBuilder.customObjects,
    build: () => mockRequestBuilder.customObjects
  },
  productTypes: {
    byKey: () => mockRequestBuilder.productTypes,
    byId: () => mockRequestBuilder.productTypes,
    build: () => mockRequestBuilder.productTypes
  },
  categories: {
    byKey: () => mockRequestBuilder.categories,
    build: () => mockRequestBuilder.categories
  },
  customers: {
    byKey: () => mockRequestBuilder.categories,
    build: () => mockRequestBuilder.categories
  }
}

const requestBuilder = {
  createRequestBuilder: () => mockRequestBuilder
}

module.exports = requestBuilder
