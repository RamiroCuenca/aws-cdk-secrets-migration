#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SecretManagerStack } from '../lib/secret-manager-stack';

const app = new cdk.App();
new SecretManagerStack(app, 'SecretManagerStack');