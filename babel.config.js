const config = {
  presets: ['module:metro-react-native-babel-preset', 'module:react-native-dotenv', 'mobx'],
  plugins: [
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

if (process.env.NODE_ENV === 'production' && !process.env.RN_SRC_EXT?.includes('e2e')) {
  config.plugins.push([
    'babel-plugin-jsx-remove-data-test-id',
    {
      attributes: 'testID',
    },
  ]);
}

module.exports = config;
