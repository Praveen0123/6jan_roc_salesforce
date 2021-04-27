import { UseCaseError } from '@vantage-point/ddd-core';


export class TenantError extends UseCaseError
{
  constructor(errorMessage: string)
  {
    super(`An error happened while retrieving tenant: ${errorMessage}`);
  }
}
