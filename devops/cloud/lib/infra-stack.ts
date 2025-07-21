import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from 'constructs';

/**
 * Responsible for setting up infrastructure like VPC, High Level IAM, ECR, Proxy, etc.
 */
export class InfraStack extends cdk.Stack {
  public readonly repo: ecr.Repository;
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /******** Create VPC ********/ 
    this.vpc = new ec2.Vpc(this, 'PostsMainVPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/26'),
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: "public1",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: "public2",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });


    /******** Create an ECR repository for Backend application ********/ 
    this.repo = new ecr.Repository(this, 'posts/main-backend-api', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      repositoryName: 'posts/main-backend-api'
    });
  
    this.repo.addLifecycleRule({
      tagStatus: ecr.TagStatus.ANY,
      maxImageCount: 10
    })
  }
}
