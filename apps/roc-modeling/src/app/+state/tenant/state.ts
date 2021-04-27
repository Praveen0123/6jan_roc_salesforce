import { Tenant } from '@gql';

export const TENANT_STORE_FEATURE_KEY = 'tenant';


export interface HighSchoolModel
{
  id: string;
  name: string;
  street: string;
  city: string;
  stateAbbreviation: string;
  zipCode: string;
  countyFIPS: string;
  countyName: string;
  latitude: string;
  longittude: string;
}

export interface TenantState
{
  tenant: Tenant;
  error: any;
}

export const initialTenantState: TenantState =
{
  tenant: null,
  error: null
};
