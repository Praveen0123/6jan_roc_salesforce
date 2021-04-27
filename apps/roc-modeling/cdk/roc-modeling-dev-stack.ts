// tslint:disable: no-unused-expression
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { SpaDeploy } from './spa-deploy';

export class RocModelingDevStack extends cdk.Stack
{
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps)
  {
    super(scope, id, props);

    // The code that defines your stack goes here
    new SpaDeploy(this, id, {
      environmentName: 'dev',
      subDomainName: 'modeling',
      domainName: 'returnon.college',
      websiteFolder: path.join(__dirname, '..', '..', '..', 'dist', 'apps', 'roc-modeling')
    });
  }
}
