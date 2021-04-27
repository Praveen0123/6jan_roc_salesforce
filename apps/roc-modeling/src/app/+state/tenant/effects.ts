import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Tenant, TenantByHostNameQuery } from '@gql';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { requestTenant, setActiveTenant } from './actions';
import { TenantService } from './tenant.service';


@Injectable()
export class TenantEffects
{

  constructor
    (
      // private store: Store,
      private actions$: Actions,
      private tenantService: TenantService
    )
  {
  }

  requestTenant$ = createEffect(() => this.actions$.pipe
    (
      ofType(requestTenant),
      switchMap(() => this.tenantService.getTenantFromDomain()),
      map((results: ApolloQueryResult<TenantByHostNameQuery>) =>
      {
        const tenant: Tenant = results.data.tenantByHostName;

        return setActiveTenant({ tenant });
      })
    ));

}
