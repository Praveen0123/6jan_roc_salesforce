import { createAction, props } from '@ngrx/store';
import { UseCaseError } from '@vantage-point/ddd-core';


export const setError = createAction
  (
    '[Errors] set error',
    props<{ useCaseError: UseCaseError; }>()
  );

export const clearError = createAction
  (
    '[Errors] cear error'
  );
