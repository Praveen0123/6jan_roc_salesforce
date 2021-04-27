import { ModuleContext } from '@graphql-modules/core';
import { UserProfile } from '@roc-modeling-gateway-models';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

import { SaveUserProfileUseCase } from '../use-cases/save-user-profile';
import { UserProfileByEmailUseCase } from '../use-cases/user-profile-by-email-address';
import { UserProfileByIdUseCase } from '../use-cases/user-profile-by-id';


export default
  {
    Query:
    {
      userById: async (_root: any, args: any, { injector }: ModuleContext): Promise<UserProfile> =>
      {
        return await injector.get(UserProfileByIdUseCase).executeAsync(args.id);
      },
      userByEmaillAddress: async (_root: any, args: any, { injector }: ModuleContext): Promise<UserProfile> =>
      {
        return await injector.get(UserProfileByEmailUseCase).executeAsync(args.emailAddress);
      }
    },
    Mutation:
    {
      saveUserProfile: async (_root: any, args: any, { injector }: ModuleContext): Promise<UserProfile> =>
      {
        return await injector.get(SaveUserProfileUseCase).executeAsync(args.userProfileInput);
      }
    },
    UserProfile:
    {
      __resolveReference: async (externalUserProfile: { id: any; }, { injector }: ModuleContext): Promise<UserProfile> =>
      {
        return await injector.get(UserProfileByIdUseCase).executeAsync(externalUserProfile.id);
      },
      fullName(userProfileModel: UserProfile): string
      {
        return `${userProfileModel.firstName} ${userProfileModel.lastName}`;
      }
    },
    Date: new GraphQLScalarType
      (
        {
          name: 'Date',
          description: 'Date custom scalar type',
          parseValue(value)
          {
            return new Date(value); // value from the client
          },
          serialize(value)
          {
            const targetDate: Date = new Date(value);

            return targetDate; // value sent to the client
          },
          parseLiteral(ast)
          {
            if (ast.kind === Kind.INT)
            {
              return new Date(+ast.value); // ast value is always in string format
            }
            if (ast.kind === Kind.STRING)
            {
              const targetDateInput: string | number = ast.value;
              return new Date(targetDateInput);
            }
            return null;
          },
        }
      )
  };
