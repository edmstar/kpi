const utils = require('../libs/utils.js');
const bodyParser = require('body-parser');
const IController = require('./icontroller.js');
const KPIData = require('../libs/data/kpi.js');

var self = null;

function KPIController(app) {
    IController.call(this, app);
    this.dataServiceKPI = new KPIData(this.app.sequelize);
    self = this;
}

IController.compose(KPIController);

/**
 * Applies routes
 */
KPIController.prototype.applyRoutes = function() {

    this.app.get("/kpi/:id", bodyParser.json(), function(req, res, next) {
        self.dataServiceKPI.load({
            id: req.params.id
        }).then((data) => res.json(utils.success(data))).catch(next);
    });

    this.app.post("/kpi", bodyParser.json(), function(req, res, next) {
        self.dataServiceKPI.create(req.body).then((data) => res.json(utils.success(data))).catch(next);
    });

    this.app.post("/kpi/value", bodyParser.json(), function(req, res, next) {
        self.dataServiceKPI.addValue(req.body).then((data) => res.json(utils.success(data))).catch(next);
    });

    this.app.post("/kpi/values/", bodyParser.json(), function(req, res, next) {
        self.dataServiceKPI.addValues(req.body).then((data) => res.json(utils.success(data))).catch(next);
    });

    this.app.post("/kpi/values/csv", bodyParser.json(), function(req, res, next) {
        self.dataServiceKPI.addValuesCsv(req.body).then((data) => res.json(utils.success(data))).catch(next);
   });

    this.app.get("/kpi/value/:id", bodyParser.json(), function(req, res, next) {
        self.dataServiceKPI.loadValue({
            id: req.params.id
        }).then((data) => res.json(utils.success(data))).catch(next);
    });

    this.app.get("/kpi/name/:name", bodyParser.json(), function(req, res, next) {
        self.dataServiceKPI.loadByName({
            name: req.params.name
        }).then((data) => res.json(utils.success(data))).catch(next);
    });
};

exports.KPIController = KPIController;
