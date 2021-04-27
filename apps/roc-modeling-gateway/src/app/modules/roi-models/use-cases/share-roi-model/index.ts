import { RoiModel, ShareRoiModelInput, UserProfile } from '@roc-modeling-gateway-models';
import { IUseCase, Result } from '@vantage-point/ddd-core';

import { Auth0UserRepoService, auth0UserRepoService } from '../../../user-profile/repos/auth0-repo.service';
import { RoiModelRepoService, roiModelRepoService } from '../../repos/roi-model-repo.service';


export class ShareRoiModelUseCase implements IUseCase<ShareRoiModelInput, Promise<RoiModel>>
{

  private constructor
    (
      private repo: RoiModelRepoService,
      private userRepo: Auth0UserRepoService
    )
  {
  }


  public static create(repo: RoiModelRepoService, userRepo: Auth0UserRepoService): ShareRoiModelUseCase
  {
    return new ShareRoiModelUseCase(repo, userRepo);
  }

  async executeAsync(input: ShareRoiModelInput): Promise<RoiModel>
  {
    const userProfileOrError: Result<UserProfile> = await this.userRepo.getOrCreateUserForSharingModel(input);

    // SUCCESS
    if (userProfileOrError.isSuccess)
    {
      const userProfile: UserProfile = userProfileOrError.getValue();
      const roiModelOrError: Result<RoiModel> = await this.repo.saveShareModel(input, userProfile);

      if (roiModelOrError.isSuccess)
      {
        return roiModelOrError.getValue();
      }

      // FAILURE
      throw roiModelOrError.getError();
    }

    // FAILURE
    throw userProfileOrError.getError();
  }
}

export const shareRoiModelUseCase: ShareRoiModelUseCase = ShareRoiModelUseCase.create(roiModelRepoService, auth0UserRepoService);
