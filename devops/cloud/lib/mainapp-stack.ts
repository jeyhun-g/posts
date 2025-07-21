import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface MainAppStackProps extends cdk.StackProps {
  vpc: ec2.Vpc
}

export class MainAppStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: MainAppStackProps) {
    super(scope, id, props);

    // Create role for AppRunner
    //  connect to DDB
    //  connect to private ECR

    // Create AppRunner with ECR image
  }
}
