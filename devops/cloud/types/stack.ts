import * as cdk from 'aws-cdk-lib';
import { Config } from '../utils/EnvConfig';

export interface CustomStackProps extends cdk.StackProps {
  config: Config
}