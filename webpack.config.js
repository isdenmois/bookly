const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelConfig = require('./babel.web');

const appDirectory = path.resolve(__dirname, './');

module.exports = {
  mode: 'development',
  entry: './src/web-app.tsx',

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  output: {
    path: __dirname + '/build',
    filename: 'bundle.js'
  },


  resolve: {
    symlinks: false,
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.web.js', '.js', '.mjs', '.jsx', '.json'],
    alias: {
      '@expo/vector-icons': 'expo-web',
      expo: 'expo-web',
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
      // 'react-native-vector-icons': 'expo-web',
      'native-base' : 'native-base-web',
      'react-native-vector-icons/Ionicons': 'native-base-web/lib/Components/Widgets/Icon',
      'react/lib/ReactNativePropRegistry': 'react-native-web/dist/modules/ReactNativePropRegistry',
      'react-icons/lib/io/arrow-back': 'react-icons/lib/io/arrow-left-a',
      'react-icons/lib/io/ios-lock': 'react-icons/lib/io/ios-locked',
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        // Add every directory that needs to be compiled by Babel during the build.
        include: [
          path.resolve(appDirectory, 'src'),
          path.resolve(appDirectory, 'node_modules/react-navigation'),
          path.resolve(appDirectory, 'node_modules/react-native'),
          path.resolve(appDirectory, 'node_modules/react-native-web'),
          path.resolve(appDirectory, 'node_modules/@expo/samples'),
          path.resolve(appDirectory, 'node_modules/@expo/vector-icons'),
          path.resolve(appDirectory, 'node_modules/react-native-auto-height-image'),
        ],
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelConfig
          },
          'awesome-typescript-loader',
        ],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.graphqls$/,
        use: 'raw-loader'
      },
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
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './fonts/[hash].[ext]',
            },
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './dev-tools/index.html'
    }),
    new webpack.DefinePlugin({
      __DEV__: true
    })
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''}
      }
    }
  }
};
