var chai = require('chai');
chai.use(require('chai-uuid'));
chai.use(require('chai-datetime'));
var expect = chai.expect;
var model = require('../models.js');
var utils = require('../../../libs/utils.js');
var testutils = require('../../testutils.js');
var constants = require('../constants.js');
var uuid = require('uuid/v4');

var KPIService = require('../../../libs/service/kpi.js');
var service = new KPIService(model.sequelize);

var contextDone = null;

describe('KPIService', function() {
    before(function() {
        this.timeout(5000);
        return model.resetModels().then(() => model.populate());
    });

    var parseCreate = function(result) {
        expect(result).to.not.equal(null);
        expect(result.dataValues.id).to.be.a.uuid();

        return result;
    };

    it('Add new KPI to database with no targets.', function() {
        return service.create(constants.kpis.KPI1).then(parseCreate);
    });

    it('Add new KPI with existing name.', function() {
        var kpi = Object.assign({}, model.mocks.KPI[0].dataValues); // copy
        kpi.id = uuid();
        delete kpi.createdAt;
        delete kpi.updatedAt;

        return service.create(kpi).catch((error) => {
            let message = error.message;
            expect(message).to.equal(service.ERROR_KPI_NOT_CREATED);
            // expect(error.name).to.equal('SequelizeUniqueConstraintError');
        });
    });

    it('Add new KPIValue', function() {
        var kpiValue = constants.kpiValues.KPIValue1;
        return service.addValue(kpiValue).then(parseCreate).then((result) => {
            expect(result.value).to.equal(kpiValue.value);
        });
    });

    it('Load the first KPI mocked in the database', function() {
        var referenceKpi = model.mocks.KPI[0];
        return service.load(referenceKpi.id).then(result => {
            expect(result.id).to.equal(referenceKpi.id);
            expect(result.name).to.equal(referenceKpi.name);
        });
    });

    it('Load the first KPI Value mocked in the database', function() {
        var referenceKpiValue = model.mocks.KPI_VALUE[0];
        service.loadValue(referenceKpiValue.id).then(result => {
            expect(result.id).to.equal(referenceKpiValue.id);
            expect(result.id_kpi).to.equal(referenceKpiValue.id_kpi);
        });
    });

    it('Load a range of KPI values given by a certain range that is contained by the all the KPI values in the database', function() {
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

        return referenceKpi.getPeriod(start, end).then(values => {
            for (let element of values) {
                let containsDate = referenceKpiValues.reduce((last, referenceElement) => last || (referenceElement.date.getTime() == element.date.getTime()), false);

                expect(containsDate).to.equals(true);
            }
            for (let referenceElement of referenceKpiValues) {
                let containsDate = values.reduce((last, element) => last || (referenceElement.date.getTime() == element.date.getTime()), false);

                expect(containsDate).to.equals(true);
            }
        });
    });
});
