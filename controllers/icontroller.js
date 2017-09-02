var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

class IController
{
    constructor(app)
    {
        this.app = app;
    }

    applyRoutes()
    {

    }
}

class RotaController extends IController
{
    constructor(app)
    {
        super(app);
    }

    applyRoutes()
    {
        this.app.get("/", function(req, res)
        {
            res.sendFile(appRoot + "/index.html");
        });
        
        this.app.post("/process_post", urlencodedParser, function(req, res)
        {
            res.end(JSON.stringify(req.body));
        });
    }
}

exports.IController = IController;
exports.RotaController = RotaController;