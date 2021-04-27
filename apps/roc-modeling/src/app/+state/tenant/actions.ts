import { Tenant } from '@gql';
import { createAction, props } from '@ngrx/store';


export const requestTenant = createAction
  (
    '[Tenant] request tenant'
  );

export const setActiveTenant = createAction
  (
    '[Tenant] set active tenant',
    props<{ tenant: Tenant; }>()
  );

export const resetTenant = createAction
  (
    '[Tenant] reset tenant'
  );
