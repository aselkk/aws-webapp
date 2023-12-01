import { buildResponse } from "../../helpers/utils";
import { getProductsFromDB } from "./getProductsFromDB";

export const handler = async (event: any) => {
  try {
    const productId = event.pathParameters.productId;

    const products = await getProductsFromDB();
    const product = products.find((p: any) => p.id === productId);

    if (product) {
      return buildResponse(200, { product });
    } else {
      return buildResponse(404, { message: 'Product not found' });
    }
  } catch (err: any) {
    return buildResponse(500, { message: err.message });
  }
};
