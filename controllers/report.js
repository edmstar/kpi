const utils = require('../libs/utils.js');
const bodyParser = require('body-parser');
const IController = require('./icontroller.js');
const ReportData = require('../libs/data/report.js');

var self = null;

function ReportController(app) {
    IController.call(this, app);
    this.dataServiceReport = new ReportData(this.app.sequelize);
    // dataServiceConsolidate = new ConsolidateData(this.app.sequelize);
    self = this;
}

IController.compose(ReportController);

/**
 * Applies routes
 */
ReportController.prototype.applyRoutes = function() {

    this.app.post("/report/period", bodyParser.json(), function(req, res, next) {
        self.dataServiceReport.getPeriodReport(req.body).then((data) => res.json(utils.success(data))).catch(next);
    });

};

exports.ReportController = ReportController;
