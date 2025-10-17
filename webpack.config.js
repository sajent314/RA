const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias['expo-location'] = 'src/lib/LocationTracker.web.ts';
  config.resolve.alias['react-native-biometrics'] = 'src/lib/Biometrics.web.ts';

  return config;
};
