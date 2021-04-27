import { UseCaseError } from '@vantage-point/ddd-core';


export class RoiModelError extends UseCaseError
{
  constructor(errorMessage: string)
  {
    super(`An error happened with roi-model: ${errorMessage}`);
  }
}
