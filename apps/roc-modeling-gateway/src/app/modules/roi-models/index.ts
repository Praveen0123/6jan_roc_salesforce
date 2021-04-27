import 'graphql-import-node';

import { GraphQLModule } from '@graphql-modules/core';

import UserProfileProvider from './providers/providers';
import resolvers from './resolvers/resolvers';
import * as typeDefs from './schema/schema.graphql';
import { RoiModelListUseCase, roiModelListUseCase } from './use-cases/roi-model-list';
import { SaveRoiModelUseCase, saveRoiModelUseCase } from './use-cases/save-roi-model';
import { ShareRoiModelUseCase, shareRoiModelUseCase } from './use-cases/share-roi-model';

export const RoiModelModule = new GraphQLModule
  (
    {
      name: 'RoiModels',
      typeDefs,
      resolvers,
      providers:
        [
          UserProfileProvider,
          {
            provide: RoiModelListUseCase,
            useFactory: () => roiModelListUseCase
          },
          {
            provide: SaveRoiModelUseCase,
            useFactory: () => saveRoiModelUseCase
          },
          {
            provide: ShareRoiModelUseCase,
            useFactory: () => shareRoiModelUseCase
          }
        ]
    }
  );
