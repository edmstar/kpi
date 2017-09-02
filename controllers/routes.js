var mController = require('./icontroller.js');

class RoutesController
{
    constructor()
    {
        this.routesList = [];
    }

    addController(controller)
    {
        this.routesList.push(controller);
    }

    applyRoutes()
    {
        this.routesList.forEach(function(controller)
        {
            controller.applyRoutes();
        });
    }
}

exports.RoutesController = RoutesController;