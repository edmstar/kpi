var argparse = require('./libs/argparse.js');
var iroutes = require('./controllers/routes.js');
var mController = require('./controllers/icontroller.js');
var path = require('path');
var express = require('express');

global.appRoot = path.resolve(__dirname);

var models = require('./models/models.js');
var sequelize = models.sequelize;

// Regenerates database if --database is passed
if (argparse.database)
    models.sequelize.sync({ force: true });

var app = express();

app.sequelize = sequelize;

var routes = iroutes.getRoutesObject(app);

routes.apply();

app.use(express.static('public'));
app.listen(8080);

exports.app = app;
