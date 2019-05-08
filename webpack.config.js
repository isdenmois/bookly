const webpack = require('webpack'),
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  babelConfig = require('./dev-tools/babel.web');
const appDirectory = path.resolve(__dirname, './');

module.exports = {
  mode: 'development',
  entry: './index.js',

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
    globalObject: 'this',
  },

  resolve: {
    symlinks: false,
    extensions: ['.web.js', '.js', '.mjs', '.jsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-svg': 'react-native-svg-web',
    },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // Add every directory that needs to be compiled by Babel during the build.
        include: [
          path.resolve(appDirectory, 'src'),
          path.resolve(appDirectory, 'config'),
          path.resolve(appDirectory, 'node_modules/react-native-vector-icons/'),
        ],
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
      // {
      //   test: /\.tsx?$/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: babelConfig
      //     },
      //     'awesome-typescript-loader',
      //   ],
      // },
      // {
      //   test: /\.mjs$/,
      //   include: /node_modules/,
      //   type: 'javascript/auto'
      // },
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
        include: path.resolve(appDirectory, 'node_modules/react-native-vector-icons/'),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './dev-tools/index.html',
    }),
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  ],
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
