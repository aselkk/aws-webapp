// getProductsFromDB.ts

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { config } from 'dotenv'

config()

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getProductsFromDB = async (): Promise<any[]> => {
  try {
    const productsCommand = new ScanCommand({
      TableName: 'products_table',
    });

    const stocksCommand = new ScanCommand({
      TableName: 'stocks_table',
    });

    const [productsResponse, stocksResponse] = await Promise.all([
      client.send(productsCommand),
      client.send(stocksCommand),
    ]);

    // Combine products with stocks based on product_id
    const combinedProducts = productsResponse.Items!.map(product => {
      const stockInfo = stocksResponse.Items!.find(stock => stock.product_id === product.id);
      return {
        id: product.id,
        count: stockInfo ? stockInfo.count : 0,
        price: product.price,
        title: product.title,
        description: product.description,
      };
    });
    console.log(combinedProducts)
    return combinedProducts;  
    
  } catch (error) {
    console.error('Error retrieving products:', error);
    throw error;
  }
};
