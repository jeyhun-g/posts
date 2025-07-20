#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DataPipelineStack } from '../lib/data-pipeline-stack';
import dotenv from 'dotenv'; 
import { EnvConfig } from '../utils/EnvConfig';
dotenv.config()

const config = EnvConfig.create()

const app = new cdk.App();
new DataPipelineStack(app, 'DataPipelineStack', {
  env: { account: config.accountId, region: process.env.CDK_DEV_REGION },
});