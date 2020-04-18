const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config();

const babelConfig = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  // presets: ['module:metro-react-native-babel-preset', 'module:react-native-dotenv'],
  plugins: [
    // [
    //   require('@babel/plugin-transform-typescript'),
    //   {
    //     isTSX: true,
    //   },
    // ],
    // '@babel/plugin-syntax-flow',
    // '@babel/plugin-transform-flow-strip-types',
    '@babel/plugin-proposal-optional-chaining',
    // '@babel/proposal-object-rest-spread',
    // '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: true,
      },
    ],
    // 'transform-class-properties',
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
const flowConfig = {
  test: /\.jsx?$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: babelConfig.presets,
      plugins: ['@babel/plugin-syntax-flow', '@babel/plugin-transform-flow-strip-types', ...babelConfig.plugins],
    },
  },
};
const typescriptConfig = {
  test: /\.tsx?$/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: babelConfig.presets,
      plugins: [
        [
          require('@babel/plugin-transform-typescript'),
          {
            isTSX: true,
          },
        ],
        ...babelConfig.plugins,
      ],
    },
  },
};

const rootDir = path.join(__dirname, '.');
const webpackEnv = process.env.NODE_ENV || 'development';

module.exports = {
  mode: webpackEnv,
  entry: './web/index.js',
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'app-[hash].bundle.js',
    globalObject: 'this',
  },
  devtool: webpackEnv === 'development' ? 'eval-source-map' : false,
  module: {
    rules: [
      flowConfig,
      typescriptConfig,
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          },
        },
      },
      {
        test: /\.ttf$/,
        loader: 'url-loader',
        include: path.resolve(__dirname, 'node_modules/react-native-vector-icons'),
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
    }),
    new webpack.DefinePlugin({
      __DEV__: webpackEnv === 'development',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.jsx', '.web.js', '.jsx', '.js'], // read files in fillowing order
    alias: Object.assign({
      'react-native$': 'react-native-web',
    }),
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    inline: true,
    hot: true,
    proxy: {
      '/api/livelib': {
        target: process.env.LIVELIB_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/livelib': '' },
        secure: false,
        onProxyReq: proxyReq => {
          proxyReq.setHeader('user-agent', 'LiveLib/4.0.5/15040005 (SM-G965F; Android 8.0.0; API 26)');
        },
      },
    },
  },
};
