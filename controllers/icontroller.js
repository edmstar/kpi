//var bodyParser = require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: false })

class IController
{
    constructor(app)
    {
        this.app = app;
    }

    applyMiddlewares() {}
    applyRoutes() {}

    error(res, error)
    {
        if (error)
        {
            res.status(401);
            res.send(error);
        }
    }
}

exports.IController = IController;