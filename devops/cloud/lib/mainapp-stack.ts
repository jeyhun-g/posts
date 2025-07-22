import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import { Construct } from 'constructs';
import { CustomStackProps } from '../types';

export interface MainAppStackProps extends CustomStackProps {
  vpc: ec2.Vpc
  ecrRepo: ecr.Repository
}

export class MainAppStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: MainAppStackProps) {
    super(scope, id, props);

    /******* Create AppRunner IAM Role *******/
    const appRunnerAccessRole = new iam.Role(this, 'AppRunnerAccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
      description: 'IAM role assumed by App Runner to access AWS resources',
    });

    appRunnerAccessRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly')
    );

    const appRunnerInstanceRole = new iam.Role(this, 'AppRunnerInstanceRole', {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
      description: 'IAM role assumed by App Runner to access AWS resources',
    });

    appRunnerInstanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')
    );

    /******* Create AppRunner AutoScalling policy *******/
    const appRunnerAutoScaling = new apprunner.CfnAutoScalingConfiguration(this, 'AutoScaling', {
      autoScalingConfigurationName: 'posts-backend-autoscaling-config',
      maxConcurrency: 40, // requests per instance before scaling up
      maxSize: 1, // Max instances
      minSize: 1, // Optional: Set to 1 for always-on, or 0 for scale-to-zero
    });
    
    /******* Create AppRunner applicaiton *******/
    new apprunner.CfnService(this, 'MainBackendAppRunnerService', {
      serviceName: 'posts-main-backend',
      sourceConfiguration: {
        imageRepository: {
          imageIdentifier: `${props?.ecrRepo.repositoryUri}:latest`,
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: '8000',
            runtimeEnvironmentVariables: [
              {
                name: 'OPENAI_API_KEY',
                value: props?.config.openaiApiKey,
              },
              {
                name: 'SERVICE_NAME',
                value: 'backend',
              },
              {
                name: 'AWS_REGION',
                value: props?.config.region,
              },
            ],
          },
        },
        authenticationConfiguration: {
          accessRoleArn: appRunnerAccessRole.roleArn,
        },
      },
      instanceConfiguration: {
        instanceRoleArn: appRunnerInstanceRole.roleArn,
        cpu: '0.5 vCPU',
        memory: '1 GB',
      },
      healthCheckConfiguration: {
        protocol: 'HTTP',
        path: '/health',
        interval: 20,
        timeout: 5,
        healthyThreshold: 3,
        unhealthyThreshold: 5,
      },
      networkConfiguration: {
        egressConfiguration: {
          egressType: 'DEFAULT',
        },
        ingressConfiguration: {
          isPubliclyAccessible: true,
        },
        ipAddressType: 'DUAL_STACK',
      },
      autoScalingConfigurationArn: appRunnerAutoScaling.attrAutoScalingConfigurationArn
    });
  }
}
