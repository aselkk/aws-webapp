import { buildResponse } from "../../helpers/utils"
import products from '../mock-data/products.json'

export const handler = async (event:any) => {

  try {
    return buildResponse(200, {
      products
    })
  } catch (err:any) {
    return buildResponse(500, {
      message: err.message
    })
  }
}