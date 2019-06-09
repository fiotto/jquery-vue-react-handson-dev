const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries'); 
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TEMPLETE_LIST = 
    ['index', 'jquery', 'react', 'vue']
        .reduce((acc, cur) => ({...acc, [`${cur}.html`]: path.join(__dirname, 'src', 'template', `${cur}.ejs`)}), {});
        
module.exports = (env, argv) => {
  const isDev = (argv.mode === 'development');
  return [
    {
      entry: {
        style: './src/style/style.scss'
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
          filename: './style/[name].css',
        })
      ]
    },
    {
      entry  : TEMPLETE_LIST,
      output : {
        path     : path.join(__dirname, 'public'),
        filename : '[name]',
      },
      module : {
        rules : [{
          test : /\.ejs$/,
          use  : [
            'html-loader',
            'ejs-html-loader'
          ]
        }]
      },
      plugins : Object.keys(TEMPLETE_LIST).map(
        (value, index) => new HtmlWebpackPlugin({
          template : TEMPLETE_LIST[value],
          filename : value
        })
      )
    }
  ]
};
