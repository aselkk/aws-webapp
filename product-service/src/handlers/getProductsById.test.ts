import { handler } from './getProductsById'
import { buildResponse } from '../../helpers/utils'
import { products } from '../mock-data/products.ts'

jest.mock('../../helpers/utils')

describe('handler', () => {
  it('should return 200 with product when product is found', async () => {
    const productId = '1'
    const event = {
      pathParameters: {
        productId,
      },
    }

    const expectedProduct = products.find((p) => p.id === productId)
    const expectedResponse = buildResponse(200, { product: expectedProduct })

    const result = await handler(event)

    expect(result).toEqual(expectedResponse)
  })

  it('should return 404 with "Product not found" message when product is not found', async () => {
    const productId = 'nonexistent'
    const event = {
      pathParameters: {
        productId,
      },
    }

    const expectedResponse = buildResponse(404, { message: 'Product not found' })

    const result = await handler(event)

    expect(result).toEqual(expectedResponse)
  })

  it('should return 500 with error message when an error occurs', async () => {
    const errorMessage = 'Internal server error'
    const event = {}

    jest.spyOn(products, 'find').mockImplementation(() => {
      throw new Error(errorMessage)
    })

    const expectedResponse = buildResponse(500, { message: errorMessage })

    const result = await handler(event)

    expect(result).toEqual(expectedResponse)
  })
})
