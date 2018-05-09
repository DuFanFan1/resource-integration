var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var index = require('./routes/index');
var api = require('./routes/api');
var passport = require('passport');
var session = require("express-session");
//使用redis实现session持久化
var redis = require('redis');
var RedisStore = require('connect-redis')(session);
var conf = require('./configure');
var swaggerJSDoc = require('swagger-jsdoc');
var Sequelize = require('sequelize');
var data = require('./database/db');
var Strategy = require('passport-local').Strategy;
var cors_setting = require('./configure').cors_setting;
// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Resource Integration System API',
    version: '1.1.0',
    description: 'NodeJS+Express RESTful API with Swagger',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

//热更新模块
if (process.env.NODE_ENV !== 'production') {
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config.js');
    var webpackCompiled = webpack(webpackConfig);

    // 配置运行时打包
    var webpackDevMiddleware = require('webpack-dev-middleware');
    app.use(webpackDevMiddleware(webpackCompiled, {
        publicPath: "/build/",
      stats: {colors: true},
      lazy: false,
      watchOptions: {
          aggregateTimeout: 300,
          poll: true
      },
    }));
  
    // 配置热更新
    var webpackHotMiddleware = require('webpack-hot-middleware');
    app.use(webpackHotMiddleware(webpackCompiled));
  }

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", cors_setting.allow_orgin_host );
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
//当extend为false的时候，键值对中的值就为‘String’或‘Array’形式，为true的时候，则可以为任何数据类型
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
// 创建Redis客户端
var redisClient = redis.createClient(conf.redisdb.port, conf.redisdb.host, {auth_pass: conf.redisdb.password});

app.use(session({
    store:new RedisStore({client:redisClient}),
    secret: "cats",
    resave:false,
    saveUninitialized:false
    }));

app.use(function (req, res, next) {

  console.log('app req.url', req.url);

    if(req.url == '/' && (!req.session || !req.session.passport || !req.session.passport.user)) {
    return res.redirect('/login');

  } 
   next();
})

app.use('/', index);

app.use('/api_v1.1',api);

app.use('/static',express.static('http'));

app.get('*', function (req, res) {
  str = req.url
  console.log('str',str)
  if(str.indexOf('/question?id=')!=-1){
    num = str.replace(/[^0-9]/ig,"")
    console.log('strnum', num)
    res.redirect('/detail'+'?id='+num)
  }else if(str.indexOf('/Allresource')!=-1){
    res.redirect('/Allresource')
  }
  
  else{ res.redirect('/');}
}) 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
