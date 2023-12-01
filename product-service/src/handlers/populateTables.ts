#!/usr/bin/env node
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { products } from '../mock-data/products'
import { config } from 'dotenv'

config()

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client);

const populateTables = async () => {
  for (const product of products) {
    const tableCommand = new PutCommand({
      TableName: 'products_table',
      Item: product,
    });
    
    await docClient.send(tableCommand);

    const stockItem = {
      product_id: product.id,
      count: Math.floor(Math.random() * 200) + 1,
    };

    const stockCommand = new PutCommand({
      TableName: 'stocks_table',
      Item: stockItem,
    });

    await docClient.send(stockCommand);
  }

  console.log('Test data inserted successfully.');
};

populateTables()