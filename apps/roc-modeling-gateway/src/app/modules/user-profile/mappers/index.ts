import { QueryResult } from 'pg';


export class UserProfileMapper
{

  static toUserProfile<T>(queryResult: QueryResult<T>, key: string): T
  {
    return JSON.parse(JSON.stringify(queryResult.rows[0][key]));
  }

}
