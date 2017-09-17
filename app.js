var iroutes = require('./controllers/routes.js');
var mController = require('./controllers/icontroller.js');
var path = require('path');
var express = require('express');

var KPI = require('./models/kpi.js');
var KPI_VALUE = require('./models/kpi_value.js');

global.appRoot = path.resolve(__dirname);
var app = express();

var routes = iroutes.getRoutesObject(app);

routes.apply();

app.use(express.static('public'));
app.listen(8080);

exports.app = app;