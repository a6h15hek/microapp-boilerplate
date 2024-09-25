const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

const currentEnv = process.env.NODE_ENV || 'dev'; // Default to 'development' if NODE_ENV is not set
const dotenvFiles = [
  './resources/.env',
  `./resources/.env.${currentEnv}`
].filter(Boolean);

const config = {
  mode: 'development',
  entry: './views/index.js',
  devtool: false,
  output: {
    path: path.resolve(__dirname, 'views', 'build'),
    filename: 'bundle.js'
  },
  devServer: {
    port: 7001, 
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@views': path.resolve(__dirname, 'views'), // Add alias for the view folder
    },
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'views/public', 'index.html')
    }),
    ...dotenvFiles.map(file => new Dotenv({ path: file })),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      exclude: 'node_modules', 
      failOnError: true
    }),
  ]
};

module.exports = config;
