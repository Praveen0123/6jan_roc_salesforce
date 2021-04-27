import 'module-alias/register';
import 'reflect-metadata';

import { buildFederatedSchema } from '@apollo/federation';
import { ApolloGateway, LocalGraphQLDataSource, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer, AuthenticationError } from 'apollo-server';
import { GraphQLRequest } from 'apollo-server-core';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import fetch from 'make-fetch-happen';

import { CONFIG } from './app/config/config';
import { RocGatewayModule } from './app/modules/app.module';

const authConfig = require('./environments/auth_config.json');

require('dotenv').config();

if (!authConfig.domain || !authConfig.audience)
{
  throw 'Please make sure that auth_config.json is in place and populated';
}

const ENVIRONMENT = process.env.ENVIRONMENT || 'DEV';

const port: string | number = process.env.PORT || CONFIG.APP.PORTS.GATEWAY;

const SERVICE_LIST = (() =>
{
  let answer: any;

  switch (ENVIRONMENT)
  {
    case CONFIG.APP.ENVIRONMENTS.LOCAL:
      {
        answer = CONFIG.SERVER_LIST.LOCAL;
        break;
      }
    case CONFIG.APP.ENVIRONMENTS.DEV:
      {
        answer = CONFIG.SERVER_LIST.DEV;
        break;
      }
    case CONFIG.APP.ENVIRONMENTS.STAGING:
      {
        answer = CONFIG.SERVER_LIST.STAGING;
        break;
      }
    case CONFIG.APP.ENVIRONMENTS.PROD:
      {
        answer = CONFIG.SERVER_LIST.PROD;
        break;
      }
    default:
      {
        answer = CONFIG.SERVER_LIST.LOCAL;
      }
  }

  return answer;
})();


const options: jwt.VerifyOptions =
{
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256']
};


function getKeyFromAuth0(header: jwt.JwtHeader, cb: jwt.SigningKeyCallback)
{
  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
  });

  client.getSigningKey(header.kid, function (err: Error, key: jwksClient.SigningKey)
  {
    if (err)
    {
      throw new AuthenticationError(err.message);
    }
    var signingKey = key.getPublicKey();
    cb(null, signingKey);
  });
}



console.log(`ENVIRONMENT: ${process.env.ENVIRONMENT} | ${ENVIRONMENT}`);
console.log(`PORT: ${port}`);
console.log('SERVICE_LIST', SERVICE_LIST);

interface IContext
{
  token?: string;
}

class AuthenticatedDataSource extends RemoteGraphQLDataSource
{
  willSendRequest({ request, context }: { request: GraphQLRequest, context: IContext; })
  {
    request.http.headers.set('authorization', context.token);
  }
}

const gateway = new ApolloGateway
  (
    {
      serviceList:
        [
          // ROC
          { name: "roc", url: SERVICE_LIST.ROC },

          // ROC CALCUALTOR (MICHAEL'S CODE)
          { name: "roc_calcualtor", url: SERVICE_LIST.ROC_CALCULATOR },

          // api.datastop.io properties:
          { name: "locations", url: SERVICE_LIST.DATASTOP_IO_LOCATIONS },
          { name: "institutions", url: SERVICE_LIST.DATASTOP_IO_INSTITUTIONS },
          { name: "occupations", url: SERVICE_LIST.DATASTOP_IO_OCCUPATIONS }
        ],
      buildService({ name, url })
      {
        console.log('gateway | buildService: ', name, url);

        if (url === SERVICE_LIST.ROC)
        {
          return new LocalGraphQLDataSource
            (
              buildFederatedSchema
                (
                  [
                    {
                      typeDefs: RocGatewayModule.typeDefs,
                      resolvers: RocGatewayModule.resolvers,
                    }
                  ]
                )
            );
        }

        return new AuthenticatedDataSource({ url });
      }
    }
  );

const server = new ApolloServer(
  {
    gateway,
    subscriptions: false,
    cors:
    {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true
    },
    context: async ({ req }) =>
    {
      let token = req.headers.authorization || '';

      if (token)
      {
        token = token.replace('Bearer ', '').trim();

        // console.log('FROM CONTEXT | TOKEN: ', token);

        const user = await new Promise((resolve, reject) =>
        {
          jwt.verify(token, getKeyFromAuth0, options, (err: Error, decoded: object | undefined) =>
          {
            if (err)
            {
              return reject(err);
            }

            resolve(decoded);
          });
        });

        // console.log('FROM CONTEXT| USER: ', user);

        return { token, user };
      }

      throw new AuthenticationError('You must be logged in to do this');
    },
    cacheControl: { defaultMaxAge: 0 },
    onHealthCheck: () => fetch(SERVICE_LIST.HEALTH_CHECK),
    introspection: true,
    playground: true
  });

server.listen(port).then(({ url }) =>
{
  console.log(`ROC Gateway Server ready at ${url}graphql`);
  console.log(`Try health check at: ${url}.well-known/apollo/server-health`);
});
