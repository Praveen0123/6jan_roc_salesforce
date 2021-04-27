import { UseCaseError } from '@vantage-point/ddd-core';


export class CreateRoiModelError extends UseCaseError
{
  private constructor(error: Error)
  {
    super(`Error happened while creating a new ROI Model:`, error);
  }

  public static create(error: Error): CreateRoiModelError
  {
    return new CreateRoiModelError(error);
  }
}


export class RoiModelMissingError extends UseCaseError
{
  private constructor(message: string, error?: Error)
  {
    super(message, error);
  }

  public static create(message: string, error?: Error): RoiModelMissingError
  {
    return new RoiModelMissingError(message, error);
  }
}


export class InvalidRoiModelError extends UseCaseError
{
  private constructor(message: string, error: Error)
  {
    super(message, error);
  }

  public static create(message: string, error: Error): InvalidRoiModelError
  {
    return new InvalidRoiModelError(message, error);
  }
}


export class RoiModelError extends UseCaseError
{
  private constructor(message: string, error: Error, errorType?: string, details?: string)
  {
    super(message, error, errorType, details);
  }

  public static create(message: string, error: Error, errorType?: string, details?: string): RoiModelError
  {
    return new RoiModelError(message, error, errorType, details);
  }
}
