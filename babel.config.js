module.exports = function(api) {
  api.cache(false);

  return {
    presets: ['module:metro-react-native-babel-preset', 'module:react-native-dotenv'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      [
        'babel-plugin-module-resolver',
        {
          root: ['./build'],
          alias: {
            'react-native-vector-icons': '@expo/vector-icons',
          },
          extensions: ['.js', '.ts', '.tsx', '.ios.js', '.android.js']
        },
      ],
      ['babel-plugin-styled-components', { ssr: false }],
    ],
  };
};
