var bodyParser = require('body-parser');
var controller = require('./icontroller.js');
var KPIData = require('../libs/data/kpi.js');
// var ConsolidateData = require('../libs/data/consolidate.js');

var dataServiceKPI = null;
var dataServiceConsolidate = null;
var self = null;

class KPIController extends controller.IController {

    constructor(app) {
        super(app);
        dataServiceKPI = new KPIData(this.app.sequelize);
        // dataServiceConsolidate = new ConsolidateData(this.app.sequelize);
        self = this;
    }

    /**
     * Applies routes
     */
    applyRoutes() {

        this.app.get("/kpi/:id", bodyParser.json(), function(req, res) {
            var callback = function(kpi, error) {
                self.error(res, error);
                res.status(200);
                res.send(kpi);
            };

            var error = (errors => {
                self.error(res, errors);
            });

            dataServiceKPI.load({
                id: req.params.id
            }, callback, error);
        });

        this.app.post("/kpi", bodyParser.json(), function(req, res) {
            var callback = function(kpi, error) {
                self.error(req, error);
                res.status(200);
                res.send(kpi);
            };

            var error = (errors => {
                self.error(res, errors);
            });

            dataServiceKPI.create(req.body, callback, error);
        });

        this.app.post("/kpi/value", bodyParser.json(), function(req, res) {
            var callback = function(kpi, error) {
                self.error(res, error);
                res.status(200);
                res.send("Successfuly added");
            };

            var error = (errors => {
                self.error(res, errors);
            });

            dataServiceKPI.addValue(req.body, callback, error);
        });

        this.app.get("/kpi/value/:id", bodyParser.json(), function(req, res) {
            var callback = function(kpiValue, error) {
                self.error(res, error);
                res.status(200);
                res.send(kpiValue);
            };

            var error = (errors => {
                self.error(res, errors);
            });

            dataServiceKPI.loadValue({
                id: req.params.id
            }, callback, error);
        });

        this.app.get("/kpi/name/:name", bodyParser.json(), function(req, red) {
            var callback = function(kpi, error) {
                self.error(res, error);
                res.status(200);
                res.send(kpi);
            };

            var error = (errors => {
                self.error(res, errors);
            });

            dataServiceKPI.loadByName({
                name: req.body.name
            }, callback, error);
        });
    }
}

exports.KPIController = KPIController;
