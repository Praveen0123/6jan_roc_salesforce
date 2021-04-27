import { createReducer, on } from '@ngrx/store';

import { resetTenant, setActiveTenant } from './actions';
import { initialTenantState } from './state';



export const tenantReducer = createReducer
  (
    initialTenantState,

    on(setActiveTenant, (state, { tenant }) => ({ ...state, tenant })),

    on(resetTenant, () => ({ ...initialTenantState }))
  );
