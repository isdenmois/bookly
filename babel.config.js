module.exports = {
  presets: ['module:metro-react-native-babel-preset', 'module:react-native-dotenv', 'mobx'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'transform-class-properties',
    [
      'babel-plugin-module-resolver',
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
