#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DataPipelineStack } from '../lib/data-pipeline-stack';
import dotenv from 'dotenv'; 
import { EnvConfig } from '../utils/EnvConfig';
import { InfraStack } from '../lib/infra-stack';
import { MainAppStack } from '../lib/mainapp-stack';
dotenv.config()

const config = EnvConfig.create()

const app = new cdk.App();

const infraStack = new InfraStack(app, 'InfraStack', {
  env: { account: config.accountId, region: config.region },
})

new MainAppStack(app, 'MainAppStack', {
  env: { account: config.accountId, region: config.region },
  vpc: infraStack.vpc
})

new DataPipelineStack(app, 'DataPipelineStack', {
  env: { 
    account: config.accountId, 
    region: config.region, 
  },
});