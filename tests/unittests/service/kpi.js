var chai = require('chai');
chai.use(require('chai-uuid'));
chai.use(require('chai-datetime'));
var expect = chai.expect;
var model = require('../models.js');
var utils = require('../../../libs/utils.js');
var constants = require('../constants.js');
var uuid = require('uuid/v4');

var KPIService = require('../../../libs/service/kpi.js');
var service = new KPIService(model.sequelize);

var contextDone = null;

describe('KPIService', function() {
    before(function(done) {
        this.timeout(5000);
        model.resetModels(function() {
            model.populate(function() {
                done();
            });
        });
    });

    function check(done, f) {
        try {
            f();
            done();
        } catch (e) {
            done(e);
        }
    }

    var parseCreate = function(result, error) {
        expect(result).to.not.equal(null);
        expect(error).to.equals(false);
        expect(result.dataValues.id).to.be.a.uuid();
    };

    it('Add new KPI to database with no targets.', function(done) {
        var createSuccessful = function(result, error) {
            check(done, () => {
                parseCreate(result, error);
            });
        };

        service.create(constants.kpis.KPI1, createSuccessful, (error) => {
            done(error);
        });
    });

    it('Add new KPI with existing name.', function(done) {
        var kpi = JSON.parse(JSON.stringify(model.mocks.KPI[0].dataValues));
        kpi.id = uuid();
        delete kpi.createdAt;
        delete kpi.updatedAt;

        service.create(kpi, (result, error) => {
            check(done, () => {
                expect(result).to.null();
                expect(error).to.equal('KPI not created.');
            });
        }, (error) => {
            check(done, () => {
                expect(error.name).to.equal('SequelizeUniqueConstraintError');
            });
        });
    });

    it('Add new KPIValue', function(done) {
        var kpiValue = constants.kpiValues.KPIValue1;
        service.addValue(kpiValue, (result, error) => {
            check(done, () => {
                parseCreate(result, error);
                expect(result.value).to.equal(kpiValue.value);
            });
        }, (error) => {
            done(error);
        });
    });

    it('Load the first KPI mocked in the database', function(done) {
        var referenceKpi = model.mocks.KPI[0];
        service.load(referenceKpi.id, (result, error) => {
            check(done, () => {
                expect(result.id).to.equal(referenceKpi.id);
                expect(result.name).to.equal(referenceKpi.name);
            });
        }, (error) => {
            done(error);
        });
    });

    it('Load the first KPI Value mocked in the database', function(done) {
        var referenceKpiValue = model.mocks.KPI_VALUE[0];
        service.loadValue(referenceKpiValue.id, (result, error) => {
            check(done, () => {
                expect(result.id).to.equal(referenceKpiValue.id);
                expect(result.id_kpi).to.equal(referenceKpiValue.id_kpi);
            });
        }, (error) => {
            done(error);
        });
    });

    it('Load a range of KPI values given by a certain range that is contained by the all the KPI values in the database', function(done) {
        var referenceKpiValues = [];
        var referenceKpi = model.mocks.KPI[0];

        // Gets start date 1 day after the first
        var start = utils.getNextDate(constants.startDate, referenceKpi.frequency, 1);
        // Gets end date 4 days before the last
        var end = utils.getNextDate(start, referenceKpi.frequency, constants.days - 4);
        for (var v in model.mocks.KPI_VALUE) {
            var value = model.mocks.KPI_VALUE[v];
            if (value.date >= start && value.date <= end)
                referenceKpiValues.push(value.dataValues);
        }

        referenceKpi.getPeriod(start, end, (values) => {
            check(done, () => {
                for (var e in values) {
                    var element = values[e];
                    var contains = false;
                    for(var i in referenceKpiValues)
                    {
                        var referenceElement = values[i];
                        if (element.date.getTime() == referenceElement.date.getTime())
                        {
                            contains = true;
                            break;
                        }
                    }
                    // Filtered date must have been found on the reference list
                    expect(contains).to.equal(true);
                }
            });
        });
    });
});
