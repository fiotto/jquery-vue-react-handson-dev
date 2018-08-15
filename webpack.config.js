const path = require('path');
const webpack = require('webpack');
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const ExtractTextPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const templeteList = {
  'index.html': path.join(__dirname, 'src', 'template', 'index.ejs'),
  'jquery.html': path.join(__dirname, 'src', 'template', 'jquery.ejs'),
  'react.html': path.join(__dirname, 'src', 'template', 'react.ejs'),
  'vue.html': path.join(__dirname, 'src', 'template', 'vue.ejs'),
};

let app = [
  {
    entry : {
      'style': path.join(__dirname, 'src', 'style', 'style.scss')
    },
    output : {
      path : path.join(__dirname, "public", "style"),
      filename : "[name].css"
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.scss/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false,
                minimize: true,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
              }
            }
          ]
/*
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          })
*/
        },
      ]
    },
    plugins: [
      //new ExtractTextPlugin('[name].css')
      new MiniCssExtractPlugin({
        // prefix は output.path
        filename: './[name].css',
      })
    ]
  },
  {
    entry  : templeteList,
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
    plugins : Object.keys(templeteList).map(
      (value, index) => new HtmlWebpackPlugin({
        template : templeteList[value],
        filename : value
      })
    )
  }
];

module.exports = app;
