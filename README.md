# Links: 
getProductsList: https://ai9wzdfsh3.execute-api.us-east-1.amazonaws.com/products,
getProductById: https://ai9wzdfsh3.execute-api.us-east-1.amazonaws.com/products/01,
cloudFront (to show that getProductsList api is integrated with FE): https://d3ey8owqmu050w.cloudfront.net/

# Welcome to your CDK TypeScript project

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`AwsWebappStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
