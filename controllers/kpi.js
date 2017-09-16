var bodyParser = require('body-parser');
var controller = require('./icontroller.js');
var models = require('../models/models.js');

class KPIController extends controller.IController
{
    applyRoutes()
    {
        this.app.get("/kpi/:id", bodyParser.json(), function(req, res)
        {
            res.status(200);
            models.KPI.findOne({ where: { id: req.params.id } }).then(kpi =>
            {
                res.send(kpi.name);
            });
        });

        this.app.post("/kpi", bodyParser.json(), function(req, res)
        {
            
            models.KPI.create({ name: "NOME!"})
            .catch(errors => {
                res.status(401);
                res.send("Errors!\n" + errors)
            })
            .then(kpi => {
                res.status(200);
                res.send("Created!");
            })
        });
    }
}

exports.KPIController = KPIController;