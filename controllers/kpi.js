var bodyParser = require('body-parser');
var controller = require('./icontroller.js');
var kpi = require('../libs/kpi.js');

var service = null;
var self = null;

class KPIController extends controller.IController
{
    constructor(app)
    {
        super(app);
        service = new kpi.KPIService(this.app);
        self = this;
    }
    applyRoutes()
    {
        this.app.get("/kpi/:id", bodyParser.json(), function(req, res)
        {
            var callback = function(kpi, error)
            {
                self.error(req, error);
                
                res.status(200);
                res.send(kpi.name);
            };

            var error = (errors => { self.error(res, errors) });

            service.load(req.params.id, callback, error);
        });

        this.app.post("/kpi", bodyParser.json(), function(req, res)
        {
            var callback = function(kpi, error)
            {
                self.error(req, error);
                
                res.status(200);
                res.send("Successfuly created!");
            };

            var error = (errors => { self.error(res, errors) });

            service.create({name: req.body.name}, callback, error);
        });
    }
}

exports.KPIController = KPIController;