export interface Config {
  accountId: string;
  accessKey: string;
  accessSecret: string;
  region: string;
  openaiApiKey: string;
  env: string;
  githubToken: string;
}


export class EnvConfig {
  static create(): Config {
    const config: Config = {
      accessKey: 'test',
      accessSecret: 'test',
      accountId: '000000000000',
      region: 'us-east-1',
      openaiApiKey: 'test',
      env: 'test',
      githubToken: 'test',
    }

    switch (process.env.NODE_ENV) {
      case 'local':
        process.env.AWS_ENDPOINT_URL="http://localhost:4566";
        break;
      case 'development':
        config.accessKey = process.env.AWS_ACCESS_KEY || ''
        config.accessSecret = process.env.AWS_ACCESS_SECRET || ''
        config.accountId = process.env.CDK_ACCOUNT || ''
        config.region = process.env.CDK_DEV_REGION || ''
        config.openaiApiKey = process.env.OPENAI_API_KEY || ''
        config.env = process.env.ENV || ''
        config.githubToken = process.env.GITHUB_TOKEN || ''
        break;
      case 'production':
        config.accessKey = process.env.AWS_ACCESS_KEY || ''
        config.accessSecret = process.env.AWS_ACCESS_SECRET || ''
        config.accountId = process.env.CDK_ACCOUNT || ''
        config.region = process.env.CDK_PROD_REGION || ''
        config.openaiApiKey = process.env.OPENAI_API_KEY || ''
        config.env = process.env.ENV || ''
        config.githubToken = process.env.GITHUB_TOKEN || ''
        break;
      default:
        throw new Error(`Environment not recognized: ${process.env.NODE_ENV}`)
    }

    process.env.AWS_ACCESS_KEY_ID=config.accessKey
    process.env.AWS_SECRET_ACCESS_KEY=config.accessSecret
    process.env.AWS_REGION=config.region

    return config
  }
}