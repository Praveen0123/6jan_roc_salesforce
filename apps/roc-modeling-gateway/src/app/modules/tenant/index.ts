import 'graphql-import-node';

import { GraphQLModule } from '@graphql-modules/core';

import TenantProvider from './providers/providers';
import resolvers from './resolvers/resolvers';
import * as typeDefs from './schema/schema.graphql';
import { TenantByHostNameUseCase, tenantByHostNameUseCase } from './use-cases/tenant-by-host-name';

export const TenantModule: GraphQLModule = new GraphQLModule
  (
    {
      name: 'Tenant',
      typeDefs,
      resolvers: resolvers,
      providers:
        [
          TenantProvider,
          {
            provide: TenantByHostNameUseCase,
            useFactory: () => tenantByHostNameUseCase
          }
        ]
    }
  );
