const inProduction = process.env.ODE_ENV === 'production';

module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);

  const config = {
    presets: [
      !inProduction && 'module:metro-react-native-babel-preset',
      inProduction && ['@rnx-kit/babel-preset-metro-react-native', { unstable_transformProfile: 'esbuild' }],
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
      // Reanimated plugin has to be listed last.
      'react-native-reanimated/plugin',
    ],
  };

  if (process.env.NODE_ENV === 'production' && !process.env.RN_SRC_EXT?.includes('e2e')) {
    config.plugins.push([
      'babel-plugin-jsx-remove-data-test-id',
      {
        attributes: 'testID',
      },
    ]);
  }

  return config;
};
