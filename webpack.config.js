const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelConfig = require('./babel.web');

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
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.jsx', '.json']
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
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
