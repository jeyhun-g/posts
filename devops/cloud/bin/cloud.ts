#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MainAppStack } from '../lib/main-app';

// TODO: Create EnvConfig class with defined env structure and validation for env variables
import dotenv from 'dotenv'; 
dotenv.config()
import AWS from 'aws-sdk';
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
  region: process.env.CDK_DEV_REGION,
});


const app = new cdk.App();
new MainAppStack(app, 'MainAppStack', {
  env: { account: process.env.CDK_ACCOUNT, region: process.env.CDK_DEV_REGION },
});