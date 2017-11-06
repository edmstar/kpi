var chai = require('chai').use(require('chai-datetime'));
var expect = chai.expect; // we are using the "expect" style of Chai
var model = require('../models.js');
var utils = require('../../../libs/utils.js');
var constants = require('../constants.js');

var ReportService = require('../../../libs/service/report.js');
var report = new ReportService(model.sequelize);

describe('ReportService', function() {
    before(function(done) {
        this.timeout(5000);
        model.resetModels(function() {
            model.populate(function() {
                done();
            });
        });
    });

    it('Generate simple KPI report', function(done) {
        var referenceDate = new Date(constants.startDate.getTime());
        report.getKpiReport({
            kpiName: "KPI|" + utils.CONSOLIDATION_TYPES.SUM + "|" + utils.FREQUENCY_TYPES.DAY,
            start: referenceDate,
            end: utils.getBeforeNextDate(referenceDate, utils.FREQUENCY_TYPES.YEAR, 1),
            frequency: utils.FREQUENCY_TYPES.YEAR
        }, function(result) {
            console.log(result);
            done();
        });
    });
});
