import { Injectable } from '@angular/core';
import { Tenant } from '@gql';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { resetTenant, setActiveTenant } from './actions';
import { selectTenant } from './selectors';

@Injectable()
export class TenantFacadeService
{

  constructor
    (
      private store: Store
    ) { }


  setActiveTenant(tenant: Tenant)
  {
    this.store.dispatch(setActiveTenant({ tenant }));
  }

  resetTenant()
  {
    this.store.dispatch(resetTenant());
  }

  getTenant$(): Observable<Tenant>
  {
    return this.store.pipe(select(selectTenant));
  }
}
