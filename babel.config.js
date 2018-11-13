module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo', 'module:react-native-dotenv'],
    plugins: [
      [
        'babel-plugin-module-resolver',
        {
          root: ['./src'],
          alias: {
            'react-native-vector-icons': '@expo/vector-icons',
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx',
          ]
        },
      ],
      ['babel-plugin-styled-components', { ssr: false }],
      'react-native-classname-to-style',
      ['react-native-platform-specific-extensions', {extensions: ['css']}],
    ],
  };
};
