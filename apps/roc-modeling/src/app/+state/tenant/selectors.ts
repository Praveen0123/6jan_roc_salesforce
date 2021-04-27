import { Tenant } from '@gql';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { TENANT_STORE_FEATURE_KEY, TenantState } from './state';


// RETRIEVE SLICE OF STATE
export const tenantSlice: MemoizedSelector<object, TenantState> = createFeatureSelector<TenantState>(TENANT_STORE_FEATURE_KEY);


export const selectTenant: MemoizedSelector<object, Tenant> = createSelector
  (
    tenantSlice,
    (state: TenantState): Tenant => state.tenant
  );
