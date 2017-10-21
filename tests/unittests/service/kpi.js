var chai = require('chai');
chai.use(require('chai-uuid'));
var expect = chai.expect;
var model = require('../models.js');
var utils = require('../../../libs/utils.js');
var constants = require('../constants.js');

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
            parseCreate(result, error);
            done();
        };

        service.create(constants.kpis.KPI1, createSuccessful, (error) => {
            done(error);
        });
    });

    it('Add new KPI with existing name.', function(done) {
        var repeat = true;

        var create = function(result, error) {
            parseCreate(result, error);
            service.create(constants.kpis.KPI2, (result, error) => {
                expect(result).to.null();
                expect(error).to.equal('KPI not created.');
            }, (error) => {
                check(done, () => {
                    expect(error.name).to.equal('SequelizeUniqueConstraintError');
                });
            });
        };

        service.create(constants.kpis.KPI2, create, (error) => {
            done(error);
        });
    });
});
