const utils = require('../libs/utils.js');

function RoutesController(app) {
    this.app = app;
    this.routesList = [];
}

RoutesController.prototype.addController = function(controller) {
    this.routesList.push(controller);
};

RoutesController.prototype.applyMiddlewares = function() {
    for (var cItem in this.routesList) {
        var controllerType = this.routesList[cItem];
        var controller = new controllerType(this.app);

        controller.applyMiddlewares();
    }
};

RoutesController.prototype.applyRoutes = function() {
    for (var cItem in this.routesList) {
        var controllerType = this.routesList[cItem];
        var controller = new controllerType(this.app);

        controller.applyRoutes();
    }
};

RoutesController.prototype.apply = function() {
    this.applyMiddlewares();
    this.applyRoutes();

    // Error middleware - only caught if .catch(next) applied
    this.app.use(function(err, req, res, next) {
        console.log(err);
        res.json(utils.error(err.toString()));
    });
};


exports.getRoutesObject = function(app) {
    var routes = new RoutesController(app);

    routes.addController(require('./authentication.js').AuthenticationController);
    routes.addController(require('./kpi.js').KPIController);
    routes.addController(require('./report.js').ReportController);

    return routes;
};
