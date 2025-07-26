#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DataPipelineStack } from '../lib/data-pipeline-stack';
import dotenv from 'dotenv'; 
import { EnvConfig } from '../utils/EnvConfig';
import { InfraStack } from '../lib/infra-stack';
import { MainAppStack } from '../lib/mainapp-stack';
// import { WebAppStack } from '../lib/webapp/webapp-stack';
import * as path from 'path'

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname,'../.env.dev')})
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.join(__dirname,'../.env.prod')})
}


const config = EnvConfig.create()

const app = new cdk.App();

const infraStack = new InfraStack(app, 'InfraStack', {
  env: { account: config.accountId, region: config.region },
})

new MainAppStack(app, 'MainAppStack', {
  env: { account: config.accountId, region: config.region },
  config,
  vpc: infraStack.vpc,
  ecrRepo: infraStack.repo
})

// Need to fix this
// new WebAppStack(app, 'WebAppStack', {
//   env: { account: config.accountId, region: config.region },
//   config,
// })

new DataPipelineStack(app, 'DataPipelineStack', {
  env: { 
    account: config.accountId, 
    region: config.region, 
  },
});