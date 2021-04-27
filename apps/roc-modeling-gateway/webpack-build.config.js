/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const CopyPlugin = require('copy-webpack-plugin');

/**
 * Extend the default Webpack configuration from nx / ng to add graphql-tag/loader
 * this webpack.config is used w/ node:deploy builder
 */
module.exports = (config) =>
{
  // console.log('*** DEPLOY BUILDER | EXTEND WEB CONFIG', config);


  // GRAPHQL TAG LOADER
  config.module.rules.unshift
    (
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    );

  // COPY ALL .graphql FILES INTO BUILD OUTPUT
  config.plugins.unshift
    (
      new CopyPlugin(
        {
          patterns:
            [
              {
                from: './apps/roc-modeling-gateway/src/**/*.graphql',
                to: 'src/[contenthash].[ext]'
              },
              {
                from: './apps/roc-modeling-gateway/package.json',
                to: 'package.json'
              }
            ]
        }
      )
    );


  return config;
};
