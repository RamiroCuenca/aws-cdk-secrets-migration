import * as cdk from 'aws-cdk-lib';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as AWS from 'aws-sdk';

interface Secret {
  parameter: string;
  secret: string;
}

export class SecretManagerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Read the secrets from the YAML file
    const secrets = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, 'secrets.yml'), 'utf8'));

    // Create a new AWS.SSM client
    const ssm = new AWS.SSM();

    // Create a new AWS.SecretsManager client
    const secretsManager = new AWS.SecretsManager();

    // Iterate over each secret in the YAML file
    secrets.secrets.forEach(async (secret) => {

      console.log(`Parameter Store - Existing parameter name : ${secret.parameter}`)
      console.log(`Secret Manager - New secret name          : ${secret.secret}`)

      // Get the value of the parameter from AWS Parameter Store
      const value = await this.getParameterValue(ssm, secret.parameter);

      // Create a new secret in AWS Secrets Manager with the same name as the parameter and the value from Parameter Store
      await this.createSecret(secretsManager, secret.secret, value);
    });
  }

  private async getParameterValue(ssm: AWS.SSM, parameter: string): Promise<string> {
    try {
      const result = await ssm.getParameter({ Name: parameter, WithDecryption: true }).promise();

      if (result.Parameter) {
        return result.Parameter.Value;
      } else {
        throw new Error(`Parameter not found: ${parameter}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async createSecret(secretsManager: AWS.SecretsManager, name: string, value: string): Promise<void> {
    await secretsManager.createSecret({
      Name: name,
      SecretString: value
    }).promise();
  }
}


