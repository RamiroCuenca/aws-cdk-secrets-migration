import * as cdk from 'aws-cdk-lib';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as AWS from 'aws-sdk';
import { Construct } from 'constructs'

interface secretsObject {
  secrets : string[][];
}

export class SecretManagerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const YAMLfile = yaml.load(fs.readFileSync(path.resolve(__dirname, 'secrets.yml'), 'utf8')) as secretsObject;

    const ssm = new AWS.SSM();

    const secretsManager = new AWS.SecretsManager();

    YAMLfile["secrets"].forEach(async (secret) => {

      console.log(`Parameter Store - Existing parameter name : ${secret[0]}`)
      console.log(`Secret Manager  - New secret name         : ${secret[1]}`)

      const value = await this.getParameterValue(ssm, secret[0]);

      await this.createSecret(secretsManager, secret[1], value);
    });
  }

  private async getParameterValue(ssm: AWS.SSM, parameter: string): Promise<string> {
    try {
      const result = await ssm.getParameter({ Name: parameter, WithDecryption: true }).promise();

      if (result.Parameter) {
        return result.Parameter.Value!;
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


