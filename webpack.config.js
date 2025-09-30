const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // Точка входа
  entry: './src/main.js',
  
  // Настройка выходного файла
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },
  
  // Генерация source-maps
  devtool: 'source-map',
  
  // Настройка devServer
  devServer: {
    static: {
      directory: path.join(__dirname, 'build'),
    },
    compress: true,
    port: 8080,
    hot: true, // Горячая перезагрузка
    open: true, // Автоматическое открытие браузера
  },
  
  // Настройка модулей
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  // Плагины
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