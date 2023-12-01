import { buildResponse } from "../../helpers/utils"
import { getProductsFromDB } from "./getProductsFromDB";

export const handler = async (event: any) => {
  try {
    const products = await getProductsFromDB();

    if (products) {
      return buildResponse(200, {
        products
      });
    } else {
      return buildResponse(500, {
        message: "Error retrieving products from the database."
      });
    }
  } catch (err: any) {
    return buildResponse(500, {
      message: err.message
    });
  }
};