import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as amplify from 'aws-cdk-lib/aws-amplify';
import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { CustomStackProps } from '../../types';

export class WebAppStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: CustomStackProps) {
    super(scope, id, props);

    /******* Create Amplify IAM Role *******/
    const amplifyServiceRole = new iam.Role(this, 'AmplifyServiceRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal(`amplify.${this.region}.amazonaws.com`),
        new iam.ServicePrincipal('amplify.amazonaws.com')
      ),
      managedPolicies: [
        cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
      description: 'IAM role for Amplify posts/webapp',
    });

    amplifyServiceRole.addToPolicy(new iam.PolicyStatement({
      sid: 'PushLogs',
      effect: iam.Effect.ALLOW,
      actions: [
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      resources: [
        'arn:aws:logs:us-east-1:620526827136:log-group:/aws/amplify/*:log-stream:*'
      ],
    }));

    amplifyServiceRole.addToPolicy(new iam.PolicyStatement({
      sid: 'CreateLogGroup',
      effect: iam.Effect.ALLOW,
      actions: ['logs:CreateLogGroup'],
      resources: ['arn:aws:logs:us-east-1:620526827136:log-group:/aws/amplify/*'],
    }));

    amplifyServiceRole.addToPolicy(new iam.PolicyStatement({
      sid: 'DescribeLogGroups',
      effect: iam.Effect.ALLOW,
      actions: ['logs:DescribeLogGroups'],
      resources: ['arn:aws:logs:us-east-1:620526827136:log-group:*'],
    }));

    const buildSpec = fs.readFileSync(path.join(__dirname, 'buildSpec.yaml')).toString();

    /******* Create Amplify WebApp *******/
    const webapp = new amplify.CfnApp(this, 'posts/webapp', {
      name: 'posts/webapp',
      platform: 'WEB_COMPUTE',
      iamServiceRole: amplifyServiceRole.roleArn,
      repository: 'https://github.com/jeyhun-g/posts',
      oauthToken: props?.config.githubToken,
      buildSpec
    });

    new amplify.CfnBranch(this, 'main', {
      appId: webapp.attrAppId,
      branchName: 'main',
      environmentVariables: [
      {
        name: 'BACKEND_URL',
        value: 'https://api.example.com'
      }
    ],
    enableAutoBuild: true,
    });
  }
}
