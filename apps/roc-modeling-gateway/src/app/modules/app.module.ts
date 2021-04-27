import { GraphQLModule } from '@graphql-modules/core';

import { RoiModelModule } from './roi-models';
import { TenantModule } from './tenant';
import { UserProfileModule } from './user-profile';


export const RocGatewayModule: GraphQLModule = new GraphQLModule
  (
    {
      imports: () =>
        [
          RoiModelModule,
          TenantModule,
          UserProfileModule
        ]
    }
  );
