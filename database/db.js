const Sequelize = require('sequelize');
var conf = require('../configure');

var testdb = new Sequelize(conf.testdb.database, conf.testdb.username, conf.testdb.password, {
  
  host: conf.testdb.host,
  dialect: conf.testdb.dialect,
  pool: {max: 5,min: 0,idle: 10000},

});

module.exports = {
  testdb
};