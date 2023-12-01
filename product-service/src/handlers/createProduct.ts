#!/usr/bin/env node
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 }  from 'uuid'


const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event: any) => {
  try {
    const requestBody = JSON.parse(event.body);

    const { title, description, price, count } = requestBody;

    const productId = uuidv4();

    const productsCommand = new PutCommand({
      TableName: 'products_table',
      Item: {
        id: productId,
        title,
        description,
        price,
      },
    });
    await docClient.send(productsCommand);

    const stocksCommand = new PutCommand({
      TableName: 'stocks_table',
      Item: {
        product_id: productId,
        count,
      },
    });

    await docClient.send(stocksCommand);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product created successfully' }),
    };
  } catch (error:any) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
