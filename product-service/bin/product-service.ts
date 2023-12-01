#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { config } from 'dotenv'

config()

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ProductServiceStack', {
  env: {region: 'us-east-1'}
})

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    PRODUCT_AWS_REGION: process.env.PRODUCT_AWS_REGION!,
    PRODUCT_TABLE_NAME: process.env.PRODUCTS_TABLE_NAME!,
    STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME!
  }
}

const getProductList = new NodejsFunction(stack, 'GetProductsListLambda', {
  ...sharedLambdaProps, 
  functionName: 'getProductsList',
  entry: 'src/handlers/getProductsList.ts'
})

const getProductById = new NodejsFunction(stack, 'GetProductByIdLambda', {
  ...sharedLambdaProps,
  functionName: 'getProductsById',
  entry: 'src/handlers/getProductsById.ts',
})

const createProduct = new NodejsFunction(stack, 'CreateProductLambda', {
  ...sharedLambdaProps,
  functionName: 'createProduct',
  entry: 'src/handlers/createProduct.ts',
})

const api = new apiGateway.HttpApi(stack, 'ProductApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY]
  }
})

api.addRoutes({
  integration: new HttpLambdaIntegration('GetProductsListIntegration', getProductList), 
  path: '/products',
  methods: [apiGateway.HttpMethod.GET]
})

api.addRoutes({
  integration: new HttpLambdaIntegration('GetProductByIdIntegration', getProductById),
  path: '/products/{productId}', 
  methods: [apiGateway.HttpMethod.GET]
})

api.addRoutes({
  integration: new HttpLambdaIntegration('CreateProduct', createProduct),
  path: '/products', 
  methods: [apiGateway.HttpMethod.POST]
})

new cdk.CfnOutput(stack, 'ProductApiEndpoint', {
  value: api.url!,
  description: 'Endpoint for the Product API'
})