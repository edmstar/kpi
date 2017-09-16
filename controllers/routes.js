class RoutesController
{
    constructor(app)
    {
        this.app = app;
        this.routesList = [];
    }

    addController(controller)
    {
        this.routesList.push(controller);
    }

    applyMiddlewares()
    {
        for(var cItem = 0; cItem < this.routesList.length; cItem++)
        {
            var controllerType = this.routesList[cItem];
            var controller = new controllerType(this.app);

            controller.applyMiddlewares();
        }
    }

    applyRoutes()
    {
        for(var cItem = 0; cItem < this.routesList.length; cItem++)
        {
            var controllerType = this.routesList[cItem];
            var controller = new controllerType(this.app);

            controller.applyRoutes();
        }
    }

    apply()
    {
        this.applyMiddlewares();
        this.applyRoutes();
    }
}


exports.getRoutesObject = function(app)
{
    var routes = new RoutesController(app);
    
    routes.addController(require('./authentication.js').AuthenticationController);
    routes.addController(require('./kpi.js').KPIController)

    return routes;
};