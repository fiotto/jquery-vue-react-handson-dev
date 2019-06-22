const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries'); 
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const TEMPLETE_LIST = 
    ['index', 'jquery', 'react', 'vue']
        .reduce((acc, cur) => ({...acc, [`${cur}.html`]: path.join(__dirname, 'src', 'template', `${cur}.ejs`)}), {});
        
module.exports = (env, argv) => {
  const isDev = (argv.mode === 'development');
  return [
    {
      entry: {
        style: './src/style/style.scss',
        top: './src/style/top.scss'
      },
      output: {
        path: path.resolve(__dirname, 'public')
      },
      devtool: isDev ? 'source-map' : false,
      module: {
        rules: [
          {
            test: /\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  sourceMap: isDev,
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: isDev,
                }
              }
            ]
          }
        ]
      },
      plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
          filename: './css/[name].css',
        })
      ],
      optimization: {
        minimizer: [new OptimizeCSSAssetsPlugin({})],
      }
    },
    {
      entry: TEMPLETE_LIST,
      output: {
        path: path.join(__dirname, 'public'),
        filename: '[name]',
      },
      module: {
        rules: [
          {
            test: /\.ejs$/,
            use: [
              'html-loader',
              'ejs-html-loader'
            ]
          },
          {
            test: /\.(png|jpe?g|gif)$/i,
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath : 'images/'
            }
          }
        ]
      },
      plugins: [
        ...Object.keys(TEMPLETE_LIST).map(
          (value, index) => new HtmlWebpackPlugin({
            template: TEMPLETE_LIST[value],
            filename: value
          })
        ),
        new CopyWebpackPlugin([
          {from:'./src/images',to:'images'} 
        ])
      ]
    }
  ]
};
