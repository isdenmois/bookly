const inProduction = process.env.NODE_ENV === 'production';

module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);

  const config = {
    presets: [
      'module:metro-react-native-babel-preset',
      process.env.NODE_ENV === 'test' && ['@babel/preset-env', { targets: { node: 'current' } }],
    ].filter(preset => preset),

    plugins: [
      'module:react-native-dotenv',
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'transform-class-properties',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            api: './src/services/api',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx', '.ios.js', '.ios.tsx'],
        },
      ],
    ],
  };

  if (inProduction && !process.env.RN_SRC_EXT?.includes('e2e')) {
    config.plugins.push([
      'babel-plugin-jsx-remove-data-test-id',
      {
        attributes: 'testID',
      },
    ]);
  }

  // Reanimated plugin has to be listed last.
  config.plugins.push('react-native-reanimated/plugin');

  return config;
};
