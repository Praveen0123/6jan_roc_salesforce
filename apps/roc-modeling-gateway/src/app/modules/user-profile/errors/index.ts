import { UseCaseError } from '@vantage-point/ddd-core';


export class UserProfileError extends UseCaseError
{
  constructor(errorMessage: string)
  {
    super(`An error happened with user profile: ${errorMessage}`);
  }
}
