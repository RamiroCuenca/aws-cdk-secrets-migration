#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SecretManagerStack } from '../lib/secret-manager-stack';

const app = new cdk.App();
new SecretManagerStack(app, 'SecretManagerStack');

// Create a new stack of SecretManagerStack
const testStack = new SecretManagerStack(app, 'AnotherSecretManagerStack', {
  env: {
    account: 'ACCOUNT_ID', // AWS account ID,
    region: 'us-east-1' // Region where the stack will be created
  }
});