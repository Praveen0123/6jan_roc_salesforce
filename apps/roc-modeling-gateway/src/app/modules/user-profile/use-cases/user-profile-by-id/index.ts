import { UserProfile } from '@roc-modeling-gateway-models';
import { IUseCase, Result } from '@vantage-point/ddd-core';

import { UserProfileRepoService, userProfileRepoService } from '../../repos/user-profile-repo.service';



export class UserProfileByIdUseCase implements IUseCase<string, Promise<UserProfile>>
{

  private constructor
    (
      private repo: UserProfileRepoService
    )
  {

  }

  public static create(repo: UserProfileRepoService): UserProfileByIdUseCase
  {
    return new UserProfileByIdUseCase(repo);
  }

  async executeAsync(input: string): Promise<UserProfile>
  {
    const userProfileOrError: Result<UserProfile> = await this.repo.getUserById(input);

    // SUCCESS
    if (userProfileOrError.isSuccess)
    {
      return userProfileOrError.getValue();
    }

    // FAILURE
    throw userProfileOrError.getError();
  }

}

export const userProfileByIdUseCase: UserProfileByIdUseCase = UserProfileByIdUseCase.create(userProfileRepoService);
