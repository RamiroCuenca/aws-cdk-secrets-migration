# Secret Manager CDK Project

This is an [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) project that has the objective of migrating secrets from the AWS Systems Manager (SSM) Parameter Store to the AWS Secrets Manager service.

## How the code works

The code defines a class called `SecretManagerStack` that extends the `Stack` class from the `aws-cdk-lib` library. The `SecretManagerStack` class is responsible for reading a YAML file called `secrets.yml`, reading values from the SSM Parameter Store, and creating new secrets in Secrets Manager.

The `secrets.yml` file contains a block called 'secrets' which is conformed by a string[][] where the first value of the substring identifies the name from the SSM Parameter we want to migrate, while the second value represents the name we want to set to our new Secrets Manager Secret.  
This way, it is expected to have the following format:

```yaml
secrets:
  -  - "/path/to/parameter1"
     - "/path/to/secret1"
  -  - "/path/to/parameter2"
     - "/path/to/secret2"
...
```

The `SecretManagerStack` class has two private methods:

- `getParameterValue`: This method takes an SSM client and a parameter name as input, and returns the value of the parameter as a string. If the parameter does not exist, it throws an error.
- `createSecret`: This method takes the SecretManagerStack's context, a secret name, and a secret value (fetched from AWS SSM Parameter Store) as input, and creates a new secret in Secrets Manager with the specified name and value.

The `SecretManagerStack` class has a single public method: the constructor. When a new `SecretManagerStack` object is created, the constructor does the following:

1. Calls the `super` constructor to create a new `Stack` object.
2. Reads the `secrets.yml` file and parses it as a `secretsObject` using the `yaml.load` function from the `js-yaml` library.
3. Creates new instances of the SSM and Secrets Manager clients using the `AWS.SSM` and `AWS.SecretsManager` classes from the `aws-sdk` library.
4. Iterates over the list of secrets in the `secretsObject` using the `forEach` method. For each secret, it does the following:
   1. Logs the names of the SSM parameter and the Secrets Manager secret.
   2. Calls the `getParameterValue` method to get the value of the SSM parameter.
   3. Calls the `createSecret` method to create a new secret in Secrets Manager with the specified name and value.

## Prerequisites

Before you can download and run this project locally, you will need the following:

- [Node.js](https://nodejs.org/) version 12 or later
- [AWS CLI](https://aws.amazon.com/cli/) version 2 or later
- [AWS CDK Toolkit](https://aws.amazon.com/cdk/docs/getting-started/toolkit)
- An AWS account

## Getting started

1. Clone this repository to your local machine using `git clone https://github.com/RamiroCuenca/aws-cdk-secrets-migration.git`.
2. Navigate to the project directory using `cd aws-cdk-secrets-migration`.
3. Install the project dependencies using `npm install`.
4. Configure the AWS CLI with your AWS account credentials using `aws configure`.
5. Run the CDK project using `cdk synth` & `cdk deploy`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.  

## FAQ

#### If I create a blank secret in AWS Secrets Manager using AWS CDK and then, I populate it value manually... if I re-deploy the project later, what would happen to the secret value? Would it be blank again or the value I populated would remain?

If you re-deploy the CDK project after creating a blank secret in Secrets Manager and manually populating its value, the CDK deployment process will not overwrite the secret value. The secret value will remain unchanged after the CDK deployment.

However, it's important to note that if you update the CDK code to include a value for the secret, and then re-deploy the project, the secret value will be updated to the value specified in the CDK code.

```
import * as sm from 'aws-cdk-lib/aws-secretsmanager';

// Create a blank secret in Secrets Manager
const secret = new sm.Secret(this, 'MySecret', {
  secretName: 'MySecretName'
});
```

and then manually populate its value through the Secrets Manager console or the Secrets Manager API, the secret value will remain unchanged after re-deploying the CDK project.

However, if you update the CDK code to include a value for the secret, like this:
import * as sm from 'aws-cdk-lib/aws-secretsmanager';

```
// Create a secret in Secrets Manager with a specified value
const secret = new sm.Secret(this, 'MySecret', {
  secretName: 'MySecretName',
  secretString: 'MySecretValue'
});
```
and re-deploy the CDK project, the secret value will be updated to MySecretValue.