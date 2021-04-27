import { RoiModel, RoiModelInput } from '@roc-modeling-gateway-models';
import { IUseCase, Result } from '@vantage-point/ddd-core';

import { RoiModelRepoService, roiModelRepoService } from '../../repos/roi-model-repo.service';



export class SaveRoiModelUseCase implements IUseCase<RoiModelInput, Promise<RoiModel>>
{

  private constructor
    (
      private repo: RoiModelRepoService
    )
  {

  }

  public static create(repo: RoiModelRepoService): SaveRoiModelUseCase
  {
    return new SaveRoiModelUseCase(repo);
  }

  async executeAsync(input: RoiModelInput): Promise<RoiModel>
  {
    const roiModelOrError: Result<RoiModel> = await this.repo.saveRoiModel(input);

    // SUCCESS
    if (roiModelOrError.isSuccess)
    {
      return roiModelOrError.getValue();
    }

    // FAILURE
    throw roiModelOrError.getError();
  }

}

export const saveRoiModelUseCase: SaveRoiModelUseCase = SaveRoiModelUseCase.create(roiModelRepoService);
