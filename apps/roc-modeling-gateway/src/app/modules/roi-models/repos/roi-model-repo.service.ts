import { RoiModel, RoiModelInput, ShareRoiModelInput, UserProfile } from '@roc-modeling-gateway-models';
import { Result } from '@vantage-point/ddd-core';
import { QueryResult } from 'pg';

import { BaseRepository } from '../../../core/base-repository';
import { RoiModelError } from '../errors';
import { RoiModelMapper } from '../mappers';

export class RoiModelRepoService extends BaseRepository
{

  private constructor()
  {
    super();
  }

  static create(): RoiModelRepoService
  {
    return new RoiModelRepoService();
  }

  async getRoiModelList(tenantId: string, userId: string): Promise<Result<RoiModel[]>>
  {
    try
    {
      const queryName: string = 'GetModelList';
      const query = `SELECT "public"."${queryName}"($1, $2)`;
      const queryResult: QueryResult<RoiModel[]> = await this.query<RoiModel[]>(query, [tenantId, userId]);
      const roiModelList: RoiModel[] = RoiModelMapper.toRoiModel<RoiModel[]>(queryResult, queryName);

      return Result.success<RoiModel[]>(roiModelList);
    }
    catch (error)
    {
      const message = `ERROR | ${error.message}`;
      const roiModelError: RoiModelError = new RoiModelError(message);

      return Result.failure<RoiModel[]>(roiModelError);
    }
  }

  async saveRoiModel(roiModelInput: RoiModelInput): Promise<Result<RoiModel>>
  {
    try
    {
      const queryName: string = 'SaveModel';
      const query = `SELECT "public"."${queryName}"($1, $2, $3, $4)`;
      const params =
        [
          roiModelInput.tenantId,
          roiModelInput.userId,
          roiModelInput.roiAggregateId,
          JSON.parse(roiModelInput.model)
        ];

      const queryResult: QueryResult<RoiModel> = await this.query<RoiModel>(query, params);
      const roiModel: RoiModel = RoiModelMapper.toRoiModel<RoiModel>(queryResult, queryName);

      return Result.success<RoiModel>(roiModel);
    }
    catch (error)
    {
      const message = `ERROR | ${error.message}`;
      const roiModelError: RoiModelError = new RoiModelError(message);

      return Result.failure<RoiModel>(roiModelError);
    }
  }

  async saveShareModel(shareRoiModelInput: ShareRoiModelInput, userProfile: UserProfile): Promise<Result<RoiModel>>
  {
    try
    {
      const queryName: string = 'SaveSharedModel';
      const query = `SELECT "public"."${queryName}"($1, $2, $3)`;
      const params =
        [
          shareRoiModelInput.tenantId,
          userProfile.id,
          shareRoiModelInput.roiAggregateId
        ];

      const queryResult: QueryResult<RoiModel> = await this.query<RoiModel>(query, params);
      const roiModel: RoiModel = RoiModelMapper.toRoiModel<RoiModel>(queryResult, queryName);

      return Result.success<RoiModel>(roiModel);
    }
    catch (error)
    {
      const message = `ERROR | ${error.message}`;
      const roiModelError: RoiModelError = new RoiModelError(message);

      return Result.failure<RoiModel>(roiModelError);
    }
  }

}


export const roiModelRepoService: RoiModelRepoService = RoiModelRepoService.create();
