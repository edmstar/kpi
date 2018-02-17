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
    before(function() {
        this.timeout(5000);
        return model.resetModels().then(() => model.populate());
    });

    it('Generate simple KPI report with KPI target and percentage margins', function() {
        var referenceDate = new Date(constants.startDate.getTime());

        // populates KPI with values
        var getReport = function(reportedKpi) {
            return report.getKpiReport({
                kpiName: reportedKpi.name,
                start: referenceDate,
                end: utils.getBeforeNextDate(referenceDate, utils.FREQUENCY_TYPES.MONTH, 3),
                frequency: utils.FREQUENCY_TYPES.MONTH
            });
        };

        var addValues = function(kpiModel) {
            return model.populateKPIValues([kpiModel]).then((resultValues) => {
                expect(resultValues).to.not.equal(null);
                return resultValues;
            });
        };

        var addKpi = function(kpiData) {
            return kpi.create(kpiData).then(resultKpi => {
                expect(resultKpi).to.not.equal(null);
                return resultKpi;
            });
        };

        // creates KPI with target in the system
        var kpiToAdd = Object.assign({}, constants.kpis.KPI3);
        kpiToAdd.target_min_type = utils.TARGET_MARGIN_TYPES.PERCENTAGE;
        kpiToAdd.target_min = "1";
        kpiToAdd.target_max_type = utils.TARGET_MARGIN_TYPES.PERCENTAGE;
        kpiToAdd.target_max = "1.2";

        let kpiModel;

        return addKpi(constants.kpis.TargetKPI1)
            .then(addValues)
            .then(() => {
                model.KPI_VALUE.update({
                    value: 1
                }, {
                    where: {
                        id_kpi: constants.kpis.TargetKPI1.id
                    }
                });
            })
            .then(updateResult => expect(updateResult).to.not.equal(null))
            .then(() => addKpi(kpiToAdd))
            .then(model => {
                kpiModel = model;
                return addValues(kpiModel);
            }).then(kpiValuesModel => {
                return getReport(kpiModel);//.then((report) => console.log(report));
            });
    });
});
