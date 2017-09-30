var iroutes = require('./controllers/routes.js');
var mController = require('./controllers/icontroller.js');
var path = require('path');
var express = require('express');

var sequelize = require('./models/models.js').sequelize;

global.appRoot = path.resolve(__dirname);
var app = express();

app.sequelize = sequelize;

var routes = iroutes.getRoutesObject(app);

routes.apply();

app.use(express.static('public'));
app.listen(8080);

exports.app = app;
