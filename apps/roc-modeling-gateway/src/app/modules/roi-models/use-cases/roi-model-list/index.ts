import { RoiModel } from '@roc-modeling-gateway-models';
import { IUseCase, Result } from '@vantage-point/ddd-core';

import { RoiModelRepoService, roiModelRepoService } from '../../repos/roi-model-repo.service';


export interface RoiModelListInput
{
  tenantId: string;
  userId: string;
}

export class RoiModelListUseCase implements IUseCase<RoiModelListInput, Promise<RoiModel[]>>
{

  private constructor
    (
      private repo: RoiModelRepoService
    )
  {

  }

  public static create(repo: RoiModelRepoService): RoiModelListUseCase
  {
    return new RoiModelListUseCase(repo);
  }

  async executeAsync(input: RoiModelListInput): Promise<RoiModel[]>
  {
    const roiModelListOrError: Result<RoiModel[]> = await this.repo.getRoiModelList(input.tenantId, input.userId);

    // SUCCESS
    if (roiModelListOrError.isSuccess)
    {
      return roiModelListOrError.getValue();
    }

    // FAILURE
    throw roiModelListOrError.getError();
  }

}

export const roiModelListUseCase: RoiModelListUseCase = RoiModelListUseCase.create(roiModelRepoService);
