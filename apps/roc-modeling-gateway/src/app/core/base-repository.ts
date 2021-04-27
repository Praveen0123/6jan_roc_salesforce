import { ClientConfig, Pool, QueryResult } from 'pg';

import { CONFIG } from '../config/config';


export const databaseClientConfig: ClientConfig =
{
  host: CONFIG.POSTGRES.HOST,
  port: parseInt(CONFIG.POSTGRES.PORT),
  database: CONFIG.POSTGRES.DATABASE,
  user: CONFIG.POSTGRES.USER,
  password: CONFIG.POSTGRES.PASSWORD
};

export abstract class BaseRepository
{
  private pool: Pool;

  constructor(clientConfig?: ClientConfig)
  {
    this.pool = new Pool(clientConfig || databaseClientConfig);
    //this.pool.connect();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query<T>(sql: string, values: any[] = []): Promise<QueryResult<T>>
  {
    const client = await this.pool.connect();

    try
    {
      const res = await client.query(sql, values);

      return res;
    }
    finally
    {
      client.release();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async querySingleRecord<T>(sql: string, value: any): Promise<QueryResult<T>>
  {
    const client = await this.pool.connect();
    const values: any[] = [];
    values.push(value);

    try
    {
      const res = await client.query(sql, values);

      return res;
    }
    finally
    {
      client.release();
    }
  }
}
