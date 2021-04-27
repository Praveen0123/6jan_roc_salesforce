import { createReducer, on } from '@ngrx/store';

import { requestLogout } from '../user/actions';
import { clearError, setError } from './actions';
import { initialErrorsState } from './state';


export const errorsReducer = createReducer
  (
    initialErrorsState,

    on(setError, (state, { useCaseError }) => ({ ...state, useCaseError })),

    on(clearError, () => ({ ...initialErrorsState })),

    on(requestLogout, () => ({ ...initialErrorsState }))

  );
