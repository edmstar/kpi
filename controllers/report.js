var bodyParser = require('body-parser');
var controller = require('./icontroller.js');
var ReportData = require('../libs/data/report.js');

var dataServiceReport = null;
var self = null;

class ReportController extends controller.IController {

    constructor(app) {
        super(app);
        dataServiceReport = new ReportData(this.app.sequelize);
        // dataServiceConsolidate = new ConsolidateData(this.app.sequelize);
        self = this;
    }

    /**
     * Applies routes
     */
    applyRoutes() {

        this.app.post("/report/period", bodyParser.json(), function(req, res) {
            var callback = function(report, error) {
                self.error(res, error);
                res.status(200);
                res.send(report);
            };

            var error = (errors => {
                self.error(res, errors);
            });
            console.log(req.body);
            dataServiceReport.getPeriodReport(req.body, callback, error);
        });

    }
}

exports.ReportController = ReportController;
