var bodyParser = require('body-parser');
var controller = require('./icontroller.js');
var kpi = require('../libs/service/kpi.js');
var consolidate = require('../libs/service/consolidate.js');

var service = null;
var self = null;

class KPIController extends controller.IController {
    constructor(app) {
        super(app);
        service = new kpi.KPIService(this.app);
        self = this;
    }
    applyRoutes() {
        this.app.get("/kpi/:id", bodyParser.json(), function (req, res) {
            var callback = function (kpi, error) {
                self.error(res, error);

                res.status(200);
                var start = new Date('2016-09-21');
                var end = new Date(start);
                end.setHours(start.getHours() + 31 * 24);
                end.setSeconds(start.getSeconds() - 1);
                consolidate.consolidate(kpi, start, end, function (values) {
                    res.send({ value: values });
                });
                console.log(kpi);
            };

            var error = (errors => { self.error(res, errors) });

            service.load(req.params.id, callback, error);
        });

        this.app.post("/kpi", bodyParser.json(), function (req, res) {
            var callback = function (kpi, error) {
                self.error(req, error);

                res.status(200);
                res.send("Successfuly created!");
            };

            var error = (errors => { self.error(res, errors) });

            service.create({ name: req.body.name, frequency: req.body.frequency }, callback, error);
        });

        this.app.post("/kpi/populate/:id", bodyParser.json(), function (req, res) {
            service.populate();
        });
    }
}

exports.KPIController = KPIController;