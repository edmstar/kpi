var chai = require('chai').use(require('chai-datetime'));
var expect = chai.expect;
var model = require('../models.js');
var utils = require('../../../libs/utils.js');
var testutils = require('../../testutils.js');
var constants = require('../constants.js');

var ReportService = require('../../../libs/service/report.js');
var report = new ReportService(model.sequelize);

var KPIService = require('../../../libs/service/kpi.js');
var kpi = new KPIService(model.sequelize);

describe('ReportService', function() {
    before(function(done) {
        this.timeout(5000);
        model.resetModels(function() {
            model.populate(function() {
                done();
            });
        });
    });

    it('Generate simple KPI report with KPI target and percentage margins', function(done) {
        var referenceDate = new Date(constants.startDate.getTime());

        // populates KPI with values
        var getReport = function(reportedKpi) {
            report.getKpiReport({
                kpiName: reportedKpi.name,
                start: referenceDate,
                end: utils.getBeforeNextDate(referenceDate, utils.FREQUENCY_TYPES.MONTH, 3),
                frequency: utils.FREQUENCY_TYPES.MONTH
            }, function(result) {
                console.log(result);
                done();
            });
        };

        var addValues = function(kpiModel, callback) {
            model.populateKPIValues([kpiModel], (resultValues) => {
                testutils.check(done, () => {
                    expect(resultValues).to.not.equal(null);
                });

                callback(resultValues);
            });
        };

        var addKpi = function(kpiData, callback) {
            kpi.create(kpiData, (resultKpi, error) => {
                testutils.check(done, () => {
                    expect(resultKpi).to.not.equal(null);
                });

                callback(resultKpi);
            });
        };

        // creates KPI with target in the system
        var kpiToAdd = Object.assign({}, constants.kpis.KPI3);
        kpiToAdd.target_min_type = utils.TARGET_MARGIN_TYPES.PERCENTAGE;
        kpiToAdd.target_min = "1";
        kpiToAdd.target_max_type = utils.TARGET_MARGIN_TYPES.PERCENTAGE;
        kpiToAdd.target_max = "1.2";

        addKpi(constants.kpis.TargetKPI1, (kpiTargetModel) => {
            addValues(kpiTargetModel, (kpiValuesTargetModel) => {
                model.KPI_VALUE.update({
                    value: 1
                }, {
                    where: {
                        id_kpi: constants.kpis.TargetKPI1.id
                    }
                }).then((updateResult) => {
                    testutils.check(done, () => {
                        expect(updateResult).to.not.equal(null);
                    });

                    addKpi(kpiToAdd, (kpiModel) => {
                        addValues(kpiModel, (kpiValuesModel) => {
                            getReport(kpiModel);
                        });
                    });
                });
            });
        });
    });
});
