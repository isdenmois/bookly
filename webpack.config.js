const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
require('dotenv').config();

const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'ios 14',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'module:react-native-dotenv',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: Object.assign({
          api: './src/services/api',
          'react-native': 'react-native-web',
        }),
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.web.js', '.web.tsx'],
      },
    ],
    ['babel-plugin-jsx-remove-data-test-id', { attributes: 'testID' }],
    'lodash',
  ],
};

const rootDir = path.join(__dirname, '.');
const webpackEnv = process.env.NODE_ENV || 'development';
const isProd = webpackEnv === 'production';

module.exports = {
  mode: webpackEnv,
  entry: './web/index.js',
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'app-[chunkhash].bundle.js',
    globalObject: 'this',
  },
  devtool: !isProd && 'eval-source-map',
  optimization: isProd
    ? {
        usedExports: true,
        minimize: true,
        minimizer: [
          new ESBuildMinifyPlugin({
            target: 'es2020',
            legalComments: 'none',
          }),
        ],
        splitChunks: {
          cacheGroups: {
            default: {
              minChunks: 2,
              reuseExistingChunk: true,
            },
            defaultVendors: {
              test: /node_modules/,
              chunks: 'initial',
              name: 'vendor',
              priority: 10,
              enforce: true,
            },
          },
        },
      }
    : {},
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'esbuild-loader',
            options: { loader: 'jsx', target: 'es2020' },
          },
          'remove-flow-types-loader',
        ],
      },
      {
        test: /\.tsx$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: babelConfig.presets,
            plugins: [
              ['@babel/plugin-transform-typescript', { isTSX: true, allowDeclareFields: true, allExtensions: true }],
              ...babelConfig.plugins,
            ],
          },
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: babelConfig.presets,
            plugins: [
              ['@babel/plugin-transform-typescript', { isTSX: false, allowDeclareFields: true, allExtensions: true }],
              ...babelConfig.plugins,
            ],
          },
        },
      },
      {
        test: /\.(gif|jpe?g|png|svg|ttf)$/,
        use: {
          loader: 'file-loader',
          options: { name: 'assets/[name].[ext]' },
        },
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.resolve(rootDir, 'dist/assets'),
        path.resolve(rootDir, 'dist/*.bundle.js'),
        path.resolve(rootDir, 'dist/*.worker.js'),
        path.resolve(rootDir, 'dist/workbox-*.js'),
        ...(process.env.JSON ? [] : [path.resolve(rootDir, 'dist/stats.json')]),
      ],
    }),
    new HtmlWebpackPlugin({
      template: './web/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(require('./package.json').version),
      __DEV__: webpackEnv === 'development',
    }),
    ...(isProd ? [] : [new webpack.HotModuleReplacementPlugin()]),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(rootDir, 'web/apple-launch-750x1334.png'), to: 'assets' },
        { from: path.resolve(rootDir, 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png'), to: 'assets' },
        { from: path.resolve(rootDir, 'web/manifest.json'), to: '' },
      ],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    ...(isProd
      ? [
          new WorkboxPlugin.GenerateSW({
            // Exclude images from the precache
            exclude: [/.(?:png|jpg|jpeg|svg)$/],
            swDest: 'sw.js',
            mode: 'production',
            skipWaiting: true,
            clientsClaim: true,
            runtimeCaching: [
              {
                urlPattern: /.(?:png|jpg|jpeg|svg)$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'images',
                  expiration: {
                    maxEntries: 20,
                  },
                },
              },
            ],
          }),
        ]
      : []),
  ],
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.jsx', '.web.js', '.jsx', '.js'],
    alias: Object.assign({
      'react-native$': 'react-native-web',
    }),
    fallback: {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    },
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
      '/api/sync': {
        target: process.env.FIREBASE_URL,
        changeOrigin: true,
        pathRewrite: { '^/api/sync': '/sync' },
        secure: false,
      },
    },
  },
};
