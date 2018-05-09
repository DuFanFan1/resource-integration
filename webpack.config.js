var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js',['main','login']);
var path = require('path');
module.exports = {
  cache: true,
  entry: {
    main: './src/index.js',
    login: ['babel-polyfill','./loginsrc/index.js'],
    question:'./resourcepage/index.js',
    sresource:'./searchresourcepage/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'public/build'),
    filename: '[name].js',
    libraryTarget: 'umd',
    // libraryExport: 'default',
    library: '[name]',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          cacheDirectory: true,
          plugins: [["import", { libraryName: "antd", style: "css" }]]
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(woff|eot|ttf|svg)$/, // Have to configure fonts loaders for the generated fonts,视频播放中出现的文字样式不识别
        loader: 'url',
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css', '.json'],
  },
  plugins: [
    // definePlugin,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    commonsPlugin
  ]
};
