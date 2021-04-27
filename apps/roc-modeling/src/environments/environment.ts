import { audience, clientId, domain } from './auth_config.json';

const apiUri = '//api-development.returnon.college';
// const apiUri = '//localhost:2000';

export const environment =
{
  production: false,
  graphql: `${apiUri}/graphql`,
  auth:
  {
    domain,
    clientId,
    audience
  },
  httpInterceptor:
  {
    allowedList: [`${apiUri}/*`]
  }
};
