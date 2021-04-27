import { QueryResult } from 'pg';


export class TenantMapper
{

  static toTenant<T>(queryResult: QueryResult<T>, key: string): T
  {
    return JSON.parse(JSON.stringify(queryResult.rows[0][key]));
  }

}
