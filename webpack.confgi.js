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
    clean: true, // Очистка директории перед новой сборкой
  },
  
  // Генерация source-maps
  devtool: 'source-map',
  
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
    // Копирование HTML файлов
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    
    // Копирование статических файлов из public в build
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          to: '',
          filter: (resourcePath) => {
            // Не копируем HTML файлы, так как ими управляет HtmlWebpackPlugin
            return !resourcePath.endsWith('.html');
          }
        }
      ]
    })
  ]
};