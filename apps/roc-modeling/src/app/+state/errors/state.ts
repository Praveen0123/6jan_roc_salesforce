import { UseCaseError } from '@vantage-point/ddd-core';

export const ERROR_STORE_FEATURE_KEY = 'errors';


export interface ErrorsState
{
  useCaseError: UseCaseError;
}

export const initialErrorsState: ErrorsState =
{
  useCaseError: null
};
