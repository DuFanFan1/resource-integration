var express = require('express');

var redis = require('redis');
var router = express.Router();
var data = require('../database/db');
const Sequelize = require('sequelize');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var user = require('../model/api_v1.1/user');
const Users = user(data.testdb, Sequelize);

var conf = require('../configure');

passport.use(new Strategy(
  function (username, password, done) {
    console.log(username)
    console.log(password)
    Users.findOne({
      where: { username: username,password:password }
    })
      .then(result => {
        if (result != null) {
          done(null, result);  
        } else {
          console.log('no user');
          done(null, false, { message: 'error username or error password' })
        }
      })
  }));

passport.serializeUser(function (user, done) {
  console.log("serializeUser user", user);
  let sessioninfo = {
    uid: user.dataValues.uid,
    username: user.dataValues.username
  }
  console.log("serializeUser sessioninfo", sessioninfo);
  done(null, sessioninfo);
});

passport.deserializeUser(function (user, done) {
  console.log("deserializeUser user", user);
  if (user != null) {
    done(null, user);
  } else {
    console.log('no user');
    done(null, false, { message: 'Incorrect userid.' })
  }
});

router.get('/detail',
  function (req, res) {
    console.log("id", req.param('id'))
    
    console.log("come in detail")
    
    const id = req.param('id')

    res.render('question', { title: 'Question', id:JSON.stringify(req.param('id'))});
  });

  router.get('/Allresource',
  function (req, res) {
    res.render('sresource');
  });
router.get('/',
  function (req, res) {
    res.render('index', { title: 'index', user: JSON.stringify(req.session.passport) });
  });


router.get('/login',
  function (req, res) {
    res.render('login');
  });

router.post('/login',
  function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      console.log('user', user);
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function (err) {
        console.log("req.session.passport",req.session.passport)
        if (err) { return next(err); }
        return res.redirect('/');
      });
    })(req, res, next);
  })

router.get('/me', function (req, res) {
  res.send(JSON.stringify(req.session.passport));
})

router.get('/logout',
  function (req, res) {
    console.log('req.sessionID',req.sessionID);
    let sessionkey = "sess:"+req.sessionID
    var redisClient = redis.createClient(conf.redisdb.port, conf.redisdb.host, {auth_pass: conf.redisdb.password});
    redisClient.del(sessionkey,function(err,reply){
      console.log('done',reply)
    })
    req.logout();
    
    return res.redirect('/');
  });


// router.get('*', function (req, res){
//   return res.redirect('/');
// })

module.exports = router;