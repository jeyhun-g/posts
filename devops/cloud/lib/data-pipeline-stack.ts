import { Stack, StackProps, RemovalPolicies } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DataPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    new dynamodb.Table(this, 'BlogUrlsRaw', {
      tableName: 'BlogUrlsRaw',
      partitionKey: {
        name: 'url',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    })
  }
}
