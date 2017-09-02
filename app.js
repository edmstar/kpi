var mRoutes = require('./controllers/routes.js');
var mController = require('./controllers/icontroller.js');
var path = require('path');
var express = require('express');

global.appRoot = path.resolve(__dirname);
var app = express();

var rota = new mController.RotaController(app);
var routes = new mRoutes.RoutesController();

routes.addController(rota);
routes.applyRoutes();

app.use(express.static('public'));
app.listen(8080);