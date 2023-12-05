#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as events from 'aws-cdk-lib/aws-events'
import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import * as targets from 'aws-cdk-lib/aws-events-targets'

const app = new cdk.App();

const stack = new cdk.Stack(app, 'ImportServiceStack', {
  env: {region: 'us-east-1'}
})

const sharedLambdaProps: Partial<NodejsFunctionProps> = {
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    BUCKET_NAME: process.env.BUCKET_NAME!,
  }
}

const importProductsFile = new NodejsFunction(stack, 'importProductsFileLambda', {
  ...sharedLambdaProps, 
  functionName: 'importProductsFile',
  entry: 'src/handlers/importProductsFile.ts'
})

const importFileParserLambda = new NodejsFunction(stack, 'ImportFileParserLambda', {
  ...sharedLambdaProps, 
  functionName: 'importFileParser',
  entry: 'src/handlers/importFileParser.ts'
})

const s3Bucket = new s3.Bucket(stack, 'YourS3BucketName', {
  removalPolicy: cdk.RemovalPolicy.DESTROY
});

const s3EventRule = new events.Rule(stack, 'S3EventRule', {
  eventPattern: {
    source: ['aws.s3'],
    detail: {
      eventName: ['ObjectCreated:*'], 
    },
    resources: [s3Bucket.bucketArn],
  },
});

s3EventRule.addEventPattern({
  detail: {
    requestParameters: {
      key: ['uploaded/*'],
    },
  },
});

s3EventRule.addTarget(new targets.LambdaFunction(importFileParserLambda));

const api = new apiGateway.HttpApi(stack, 'importProductsFileApi', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY]
  }
})

api.addRoutes({
  integration: new HttpLambdaIntegration('importProductsFileIntegration', importProductsFile), 
  path: '/import',
  methods: [apiGateway.HttpMethod.GET]
})

new cdk.CfnOutput(stack, 'iimportProductsFileEndpoint', {
  value: api.url!,
  description: 'Endpoint for the Import Products API'
})