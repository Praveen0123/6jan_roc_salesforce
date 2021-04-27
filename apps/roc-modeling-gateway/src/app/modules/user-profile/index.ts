import 'graphql-import-node';

import { GraphQLModule } from '@graphql-modules/core';

import UserProfileProvider from './providers/providers';
import resolvers from './resolvers/resolvers';
import * as typeDefs from './schema/schema.graphql';
import { SaveUserProfileUseCase, saveUserProfileUseCase } from './use-cases/save-user-profile';
import { UserProfileByEmailUseCase, userProfileByEmailUseCase } from './use-cases/user-profile-by-email-address';
import { UserProfileByIdUseCase, userProfileByIdUseCase } from './use-cases/user-profile-by-id';

export const UserProfileModule = new GraphQLModule
  (
    {
      name: 'UserProfiles',
      typeDefs,
      resolvers,
      providers:
        [
          UserProfileProvider,
          {
            provide: UserProfileByEmailUseCase,
            useFactory: () => userProfileByEmailUseCase
          },
          {
            provide: UserProfileByIdUseCase,
            useFactory: () => userProfileByIdUseCase
          },
          {
            provide: SaveUserProfileUseCase,
            useFactory: () => saveUserProfileUseCase
          }
        ]
    }
  );
