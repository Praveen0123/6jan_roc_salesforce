import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { TenantByHostNameGQL, TenantByHostNameQuery } from '@gql';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService
{

  constructor
    (
      private tenantByHostNameGQL: TenantByHostNameGQL
    )
  {
  }

  getTenantFromDomain(): Observable<ApolloQueryResult<TenantByHostNameQuery>>
  {
    const hostName: string = document.location.host;

    // console.log('HELLO FROM GET TENANT', hostName);

    return this.tenantByHostNameGQL.fetch({ hostName: hostName });
  }

}
