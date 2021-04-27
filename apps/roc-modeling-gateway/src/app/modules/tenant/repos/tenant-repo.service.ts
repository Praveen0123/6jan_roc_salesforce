import { Tenant } from '@roc-modeling-gateway-models';
import { Result } from '@vantage-point/ddd-core';
import { QueryResult } from 'pg';

import { BaseRepository } from '../../../core/base-repository';
import { TenantError } from '../errors';
import { TenantMapper } from '../mappers';

export class TenantRepoService extends BaseRepository
{

  private constructor()
  {
    super();
  }

  static create(): TenantRepoService
  {
    return new TenantRepoService();
  }

  async getTenantByHostName(hostName: string): Promise<Result<Tenant>>
  {
    try
    {
      const queryName: string = 'GetTenantByHostName';
      const query = `SELECT "public"."${queryName}"($1)`;
      const queryResult: QueryResult<Tenant> = await this.querySingleRecord<Tenant>(query, hostName);
      const tenant: Tenant = TenantMapper.toTenant<Tenant>(queryResult, queryName);

      return Result.success<Tenant>(tenant);
    }
    catch (error)
    {
      const message = `ERROR | ${hostName} | ${error.message}`;
      const tenantError: TenantError = new TenantError(message);

      return Result.failure<Tenant>(tenantError);
    }
  }

}


export const tenantRepoService: TenantRepoService = TenantRepoService.create();
