import { ShareRoiModelInput, UserProfile, UserProfileInput } from '@roc-modeling-gateway-models';
import { Result } from '@vantage-point/ddd-core';

import { CONFIG } from '../../../config/config';
import { Auth0Manager } from '../../../core/auth0-manager';
import { UserProfileError } from '../errors';
import { UserProfileRepoService, userProfileRepoService } from './user-profile-repo.service';



const got = require('got');


export class Auth0UserRepoService extends Auth0Manager
{

  private constructor
    (
      private repo: UserProfileRepoService
    )
  {
    super();
  }

  static create(repo: UserProfileRepoService): Auth0UserRepoService
  {
    return new Auth0UserRepoService(repo);
  }

  async getUserByEmailAddress(emailAddress: string): Promise<Result<UserProfile>>
  {
    try
    {
      const url: string = `${CONFIG.AUTH0.API_USERS}?q=${emailAddress}`;

      const { body } = await got.get(url,
        {
          headers: { authorization: super.auth0Token.token },
          responseType: 'json'
        });

      if (body && body.length > 0)
      {
        const userProfile: UserProfile =
        {
          id: body[0].user_id,
          emailAddress: body[0].email,
          firstName: body[0].given_name,
          lastName: body[0].family_name,
          fullName: body[0].name,
          hasCompletedOnboarding: false
        };

        return Result.success<UserProfile>(userProfile);
      }

      const message = `ERROR | ${emailAddress} does not exist`;
      const error: UserProfileError = new UserProfileError(message);

      return Result.failure<UserProfile>(error);
    }
    catch (err)
    {
      const message = `ERROR | GET: ${err.message}`;
      const error: UserProfileError = new UserProfileError(message);

      return Result.failure<UserProfile>(error);
    }
  }

  async createNewUserForSharingModel(input: ShareRoiModelInput): Promise<Result<UserProfile>>
  {
    try
    {
      const url: string = `${CONFIG.AUTH0.API_USERS}`;

      const { body } = await got.post(url,
        {
          headers: { authorization: super.auth0Token.token },
          json:
          {
            "email": input.emailAddress,
            "given_name": input.firstName,
            "family_name": input.lastName,
            "name": `${input.firstName} ${input.lastName}`,
            "connection": "email"
          },
          responseType: 'json'
        });

      const userProfileInput: UserProfileInput =
      {
        tenantId: input.tenantId,
        id: body.user_id,
        emailAddress: input.emailAddress,
        firstName: input.firstName,
        lastName: input.lastName,
        userType: input.userType,
        highSchoolId: null,
        hasCompletedOnboarding: false
      };

      // SAVE NEW USER TO DATA STORE
      await this.repo.saveUseProfile(userProfileInput);


      const userProfile: UserProfile =
      {
        id: body.user_id,
        emailAddress: body.email,
        firstName: body.given_name,
        lastName: body.family_name,
        fullName: body.name,
        hasCompletedOnboarding: false
      };

      return Result.success<UserProfile>(userProfile);
    }
    catch (err)
    {
      const message = `ERROR | CREATE: ${err.message}`;
      const error: UserProfileError = new UserProfileError(message);

      return Result.failure<UserProfile>(error);
    }
  }

  async getOrCreateUserForSharingModel(input: ShareRoiModelInput): Promise<Result<UserProfile>>
  {
    try
    {

      // GET USER BY EMAIL ADDRESS
      const existingUserProfileOrError: Result<UserProfile> = await this.getUserByEmailAddress(input.emailAddress);

      if (existingUserProfileOrError.isSuccess)
      {
        return Result.success<UserProfile>(existingUserProfileOrError.getValue());
      }


      // CREATE A NEW USER
      const newUserProfileOrError: Result<UserProfile> = await this.createNewUserForSharingModel(input);

      if (newUserProfileOrError.isSuccess)
      {
        return Result.success<UserProfile>(newUserProfileOrError.getValue());
      }

      return Result.failure<UserProfile>(newUserProfileOrError.getError());
    }
    catch (err)
    {
      const message = `ERROR | ${err.message}`;
      const error: UserProfileError = new UserProfileError(message);

      return Result.failure<UserProfile>(error);
    }
  }

}


export const auth0UserRepoService: Auth0UserRepoService = Auth0UserRepoService.create(userProfileRepoService);
