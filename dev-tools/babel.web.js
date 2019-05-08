module.exports = {
  presets: ['module:react-native-dotenv', '@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
    'react-hot-loader/babel',
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src', './src/shared'],
        alias: Object.assign(
          {
            api: './src/services/api',
            'react-native': 'react-native-web',
            // 'react-native-vector-icons': 'expo-web',
            'native-base': 'native-base-web',
            'react-native-vector-icons/Ionicons': 'native-base-web/lib/Components/Widgets/Icon',
            'react/lib/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
            'react-native-auto-height-image': 'react-native-web/dist/cjs/exports/Image',
          },
          [
            'ActivityIndicator',
            'Alert',
            'AsyncStorage',
            'Button',
            'DeviceInfo',
            'Modal',
            'NativeModules',
            'Platform',
            'SafeAreaView',
            'SectionList',
            'StyleSheet',
            'Switch',
            'Text',
            'TextInput',
            'TouchableHighlight',
            'TouchableWithoutFeedback',
            'View',
            'ViewPropTypes',
          ].reduce((acc, curr) => {
            acc[curr] = `react-native-web/dist/cjs/exports/${curr}`;
            return acc;
          }),
        ),
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
          '.web.js',
          '.web.tsx',
        ],
      },
    ],
  ],
};
