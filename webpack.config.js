const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },
  
  resolve: {
    extensions: ['.js', '.json', '.css']
  },
  
  devtool: 'source-map',
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 8080,
    hot: true,
    open: true,
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['last 2 versions', 'ie >= 11']
                },
                useBuiltIns: 'entry',
                corejs: 3
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          filter: (resourcePath) => {
            return !resourcePath.endsWith('.html');
          }
        }
      ]
    })
  ]
};