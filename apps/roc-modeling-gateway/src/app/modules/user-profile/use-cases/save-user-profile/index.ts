import { UserProfile, UserProfileInput } from '@roc-modeling-gateway-models';
import { IUseCase, Result } from '@vantage-point/ddd-core';

import { UserProfileRepoService, userProfileRepoService } from '../../repos/user-profile-repo.service';



export class SaveUserProfileUseCase implements IUseCase<UserProfileInput, Promise<UserProfile>>
{

  private constructor
    (
      private repo: UserProfileRepoService
    )
  {

  }

  public static create(repo: UserProfileRepoService): SaveUserProfileUseCase
  {
    return new SaveUserProfileUseCase(repo);
  }

  async executeAsync(input: UserProfileInput): Promise<UserProfile>
  {
    const userProfileOrError: Result<UserProfile> = await this.repo.saveUseProfile(input);

    // SUCCESS
    if (userProfileOrError.isSuccess)
    {
      return userProfileOrError.getValue();
    }

    // FAILURE
    throw userProfileOrError.getError();
  }

}

export const saveUserProfileUseCase: SaveUserProfileUseCase = SaveUserProfileUseCase.create(userProfileRepoService);
