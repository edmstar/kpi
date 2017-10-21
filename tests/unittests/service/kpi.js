var chai = require('chai');
chai.use(require('chai-uuid'));
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

    it('Add new KPI with no targets.', function(done) {
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
        var kpi = JSON.parse(JSON.stringify(constants.kpis.KPI1));
        kpi.id = uuid();

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

    it('Load KPI', function(done) {
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

    it('Load KPI Value', function(done) {
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
});
