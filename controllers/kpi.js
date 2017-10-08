var bodyParser = require('body-parser');
var controller = require('./icontroller.js');
var KPIService = require('../libs/service/kpi.js');
var ConsolidateService = require('../libs/service/consolidate.js');

var service = null;
var consolidate = null;
var self = null;

class KPIController extends controller.IController {

    constructor(app) {
        super(app);
        service = new KPIService(this.app.sequelize);
        consolidate = new ConsolidateService(this.app.sequelize);
        self = this;
    }

    /**
     * Applies routes
     */
    applyRoutes() {

        this.app.get("/kpi/:id", bodyParser.json(), function (req, res) {
            var callback = function (kpi, error) {
                self.error(res, error);
                res.status(200);
                res.send(kpi);
            };

            var error = (errors => { self.error(res, errors); });
            service.load(req.params.id, callback, error);
        });

        this.app.post("/kpi", bodyParser.json(), function (req, res) {
            var callback = function (kpi, error) {
                self.error(req, error);

                res.status(200);
                res.send("Successfuly created!");
            };

            var error = (errors => { self.error(res, errors); });

            service.create({ name: req.body.name, frequency: req.body.frequency }, callback, error);
        });

        this.app.post("/kpi/populate/:id", bodyParser.json(), function (req, res) {
            service.populate({ id_kpi: req.params.id });
        });
    }
}

exports.KPIController = KPIController;
