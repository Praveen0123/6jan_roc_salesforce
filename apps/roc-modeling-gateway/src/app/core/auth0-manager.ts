import { CONFIG } from '../config/config';

const got = require('got');
interface Auth0Token
{
  token_type: string;
  access_token: string;
  token: string;
}


export abstract class Auth0Manager
{
  private _auth0Token: Auth0Token;

  get auth0Token(): Auth0Token
  {
    return this._auth0Token;
  }

  constructor()
  {
    (async () =>
    {
      const url: string = `${CONFIG.AUTH0.API}/oauth/token`;
      const audience: string = `${CONFIG.AUTH0.API}/api/v2/`;

      const { body } = await got.post(url,
        {
          json:
          {
            client_id: CONFIG.AUTH0.CLIENT_ID,
            client_secret: CONFIG.AUTH0.CLIENT_SECRET,
            audience: audience,
            grant_type: 'client_credentials'
          },
          responseType: 'json'
        });

      const answer: Auth0Token =
      {
        token_type: body.token_type,
        access_token: body.access_token,
        token: `${body.token_type} ${body.access_token}`
      };

      this._auth0Token = answer;

      // console.log('body', body);
      // console.log('answer', answer);
    })();
  }
}
