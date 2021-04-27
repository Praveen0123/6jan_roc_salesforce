import { audience, clientId, domain } from './auth_config.json';

const apiUri = '//api-development.returnon.college';

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
