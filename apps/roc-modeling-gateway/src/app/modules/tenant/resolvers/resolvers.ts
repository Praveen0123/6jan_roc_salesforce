import { ModuleContext } from '@graphql-modules/core';
import { Tenant } from '@roc-modeling-gateway-models';

import { TenantByHostNameUseCase } from '../use-cases/tenant-by-host-name';


export default
  {
    Query:
    {
      tenantByHostName: async (_root: any, args: any, { injector }: ModuleContext): Promise<Tenant> =>
      {
        return await injector.get(TenantByHostNameUseCase).executeAsync(args.hostName);
      }
    },
    Tenant:
    {
      __resolveReference: (externalTenant: { id: any; }) =>
      ({
        id: externalTenant.id,
        name: 'dev',
        hostName: 'some host',
        description: 'dev environment'
      })
    }
  };
