//var bodyParser = require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

class IController
{
    constructor(app)
    {
        this.app = app;
    }

    applyMiddlewares() {};
    applyRoutes() {}
}

exports.IController = IController;