const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const Dotenv = require('dotenv-webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.plugins.push(
    new Dotenv({
      path: './.env',
    })
  );

  return config;
};
