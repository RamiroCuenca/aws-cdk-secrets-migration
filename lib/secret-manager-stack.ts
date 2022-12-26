import * as cdk from 'aws-cdk-lib';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as AWS from 'aws-sdk';
import { Construct } from 'constructs';
import * as sm from 'aws-cdk-lib/aws-secretsmanager'

// An interface representing an object with a "secrets" property
// that is an array of arrays of strings
interface secretsObject {
  secrets : string[][];
}

// A class that extends the "Stack" class from the "aws-cdk-lib" library
export class SecretManagerStack extends cdk.Stack {
  // The constructor for the class
  // The "scope" and "id" parameters are required for all CDK constructs
  // The "props" parameter is optional and allows you to specify additional
  // properties for the stack
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // Call the super constructor to create a new "Stack" object
    super(scope, id, props);

    // Read the "secrets.yml" file, parse it as a "secretsObject", and store it in a variable
    const YAMLfile = yaml.load(fs.readFileSync(path.resolve(__dirname, 'secrets.yml'), 'utf8')) as secretsObject;

    // Create a new client for the AWS Systems Manager (SSM) service
    const ssm = new AWS.SSM();

    // Iterate over the list of secrets in the "secretsObject"
    YAMLfile["secrets"].forEach(async (secret) => {
      // Log the names of the SSM parameter and the Secrets Manager secret
      console.log(`Parameter Store - Existing parameter name : ${secret[0]}`)
      console.log(`Secret Manager  - New secret name         : ${secret[1]}`)

      // Get the value of the SSM parameter
      const value = await this.getParameterValue(ssm, secret[0]);

      // Create a new secret in Secrets Manager with the specified name and value
      await this.createSecret(this, secret[1], value);
    });
  }

  // A private method for getting the value of an SSM parameter
  private async getParameterValue(ssm: AWS.SSM, parameter: string): Promise<string> {
    try {
      // Call the "getParameter" method on the SSM client to get the value of the parameter
      const result = await ssm.getParameter({ Name: parameter, WithDecryption: true }).promise();

      // If the parameter was found, return its value
      if (result.Parameter) {
        return result.Parameter.Value!;
      } else {
        // If the parameter was not found, throw an error
        throw new Error(`Parameter not found: ${parameter}`);
      }
    } catch (error) {
      // If there was an error getting the parameter, log the error and throw it
      console.error(error);
      throw error;
    }
  }

  // A private method for creating a new secret in Secrets Manager
  private async createSecret(ctx: any, name: string, value: string): Promise<void> {
    // Call the "createSecret" method on the Secrets Manager client to create a new secret
    const secret = new sm.Secret(ctx, name, {
      secretName        : name,
      secretStringValue : cdk.SecretValue.unsafePlainText(value)
    })
  }
}