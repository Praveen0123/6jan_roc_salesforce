import { Tenant } from '@roc-modeling-gateway-models';
import { IUseCase, Result } from '@vantage-point/ddd-core';

import { TenantRepoService, tenantRepoService } from '../../repos/tenant-repo.service';

export class TenantByHostNameUseCase implements IUseCase<string, Promise<Tenant>>
{

  private constructor
    (
      private repo: TenantRepoService
    )
  {

  }

  public static create(repo: TenantRepoService): TenantByHostNameUseCase
  {
    return new TenantByHostNameUseCase(repo);
  }

  async executeAsync(input: string): Promise<Tenant>
  {
    const tenantOrError: Result<Tenant> = await this.repo.getTenantByHostName(input);

    // SUCCESS
    if (tenantOrError.isSuccess)
    {
      return tenantOrError.getValue();
    }

    // FAILURE
    throw tenantOrError.getError();
  }

}

export const tenantByHostNameUseCase: TenantByHostNameUseCase = TenantByHostNameUseCase.create(tenantRepoService);
