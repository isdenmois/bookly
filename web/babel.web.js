module.exports = {
  presets: ['@babel/env', '@babel/react', 'module:react-native-dotenv'],
  plugins: [
    '@babel/plugin-transform-typescript',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'transform-class-properties',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: Object.assign(
          {
            api: './src/services/api',
            'react-native': 'react-native-web',
            // // 'react-native-vector-icons': 'expo-web',
            // 'native-base': 'native-base-web',
            // 'react-native-vector-icons/Ionicons': 'native-base-web/lib/Components/Widgets/Icon',
            // 'react/lib/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
            // 'react-native-auto-height-image': 'react-native-web/dist/cjs/exports/Image',
          },
          // [
          //   'ActivityIndicator',
          //   'Alert',
          //   'AsyncStorage',
          //   'Button',
          //   'DeviceInfo',
          //   'Modal',
          //   'NativeModules',
          //   'Platform',
          //   'SafeAreaView',
          //   'SectionList',
          //   'StyleSheet',
          //   'Switch',
          //   'Text',
          //   'TextInput',
          //   'TouchableHighlight',
          //   'TouchableWithoutFeedback',
          //   'View',
          //   'ViewPropTypes',
          // ].reduce((acc, curr) => {
          //   acc[curr] = `react-native-web/dist/cjs/exports/${curr}`;
          //   return acc;
          // }),
        ),
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.web.js', '.web.tsx'],
      },
    ],
    [
      'babel-plugin-jsx-remove-data-test-id',
      {
        attributes: 'testID',
      },
    ],
  ],
};
