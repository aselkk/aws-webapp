#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AwsWebappStack } from '../lib/aws-webapp-stack';

const app = new cdk.App();
new AwsWebappStack(app, 'AwsWebappStack');
