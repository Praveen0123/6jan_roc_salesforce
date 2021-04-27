import { audience, clientId, domain } from './auth_config.json';

const apiUri = '//api-development.returnon.college';
// const apiUri = '//api.returnon.college';

export const environment =
{
  production: true,
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
