var chai = require('chai').use(require('chai-datetime'));
var expect = chai.expect; // we are using the "expect" style of Chai
var model = require('../models.js');
var utils = require('../../../libs/utils.js');
var constants = require('../constants.js')

var ConsolidateService = require('../../../libs/service/consolidate.js');
var consolidate = new ConsolidateService(model.sequelize);

describe('ConsolidateService', function () {
  before(function (done) {
    this.timeout(5000);
    model.resetModels(function () {
      model.populate(function () {
        done();
      });
    });
  });


  it('ConsolidateServe.consolidateValues(values, consolidation) should return the consolidated value based on consolidation type provided', function () {
    var startDate = new Date('2000-01-01T00:00:00Z');
    var data = [
      {
        date: startDate,
        value: 2.0,
        weight: 2.0
      },
      {
        date: utils.getNextDate(startDate, utils.FREQUENCY_TYPES.DAY),
        value: 1.0,
        weight: 1.0
      },
      {
        date: utils.getNextDate(startDate, utils.FREQUENCY_TYPES.DAY, 2),
        value: 3.0,
        weight: 3.0
      },
    ];

    expect(consolidate.consolidateValues(data, utils.CONSOLIDATION_TYPES.SUM)).to.equal(6.0);

    expect(consolidate.consolidateValues(data, utils.CONSOLIDATION_TYPES.MEAN)).to.equal(2.0);

    expect(consolidate.consolidateValues(data, utils.CONSOLIDATION_TYPES.WEIGHTED)).to.equal(14.0 / 6.0);

    expect(consolidate.consolidateValues(data, utils.CONSOLIDATION_TYPES.MIN)).to.equal(1.0);

    expect(consolidate.consolidateValues(data, utils.CONSOLIDATION_TYPES.MAX)).to.equal(3.0);

  });

  it('ConsolidateService.mergeDateValues(empty, data) should return 5 dates with values and 2 dates without values ordered by date ascending', function () {
    var start = new Date('2010-10-04T00:00:00Z');
    var end = utils.getNextDate(start, utils.FREQUENCY_TYPES.DAY, 4);
    var empty = utils.getDateRange(start, end, utils.FREQUENCY_TYPES.DAY);
    var data = [
      {
        date: start,
        value: 1.0,
        weight: 1.0
      },
      {
        date: utils.getNextDate(start, utils.FREQUENCY_TYPES.DAY, -1),
        value: 1.0,
        weight: 1.0
      },
      {
        date: utils.getNextDate(start, utils.FREQUENCY_TYPES.DAY, 4),
        value: 1.0,
        weight: 1.0
      },
      {
        date: utils.getNextDate(start, utils.FREQUENCY_TYPES.DAY, 2),
        value: 1.0,
        weight: 1.0
      },
      {
        date: utils.getNextDate(start, utils.FREQUENCY_TYPES.DAY, 6),
        value: 1.0,
        weight: 1.0
      }
    ];

    var dates = consolidate.mergeDateValues(empty, data);

    // Check lenght
    expect(dates).to.have.length(7);

    for (var index = 1; index < dates.length; index++) {
      // Check if ordering is ascending
      expect(dates[index].date).to.afterDate(dates[index - 1].date);
    }

    var countValues = 0;
    var countWeight = 0;
    for (var index in dates) {
      var date = dates[index];
      if (date.value)
        countValues++;

      if (date.weight)
        countWeight++;
    }

    expect(countValues).to.equal(5);
    expect(countWeight).to.equal(5);

  });

  it('ConsolidateService.consolidate(kpi, start, end, callback) should return 100 for KPI with {frequency=day, consolidation=sum, multipleConsolidation=sum}', function (done) {

    var name = "KPI|" + utils.CONSOLIDATION_TYPES.SUM + "|" + utils.FREQUENCY_TYPES.DAY;

    evaluateKpiConsolidation(name, 100, done);
  });

  it('ConsolidateService.consolidate(kpi, start, end, callback) should return 10 for KPI with {frequency=day, consolidation=mean, multipleConsolidation=sum}', function (done) {

    var name = "KPI|" + utils.CONSOLIDATION_TYPES.MEAN + "|" + utils.FREQUENCY_TYPES.DAY;

    evaluateKpiConsolidation(name, 10, done);
  });

});

function evaluateKpiConsolidation(name, value, done) {
  var kpi = null;

  model.KPI.findAll({
    where: {
      name: name
    }
  }).catch(function () {
    expect.fail(0, 1, "KPI not found");
    done();
  }).then(function (values) {
    expect(values).to.have.length(1);
    kpi = values[0];

    var start = constants.startDate;
    var end = utils.getNextDate(start, kpi.frequency, constants.days - 1);

    consolidate.consolidate(kpi, start, end, function (result) {
      expect(result).to.equal(value);
      done();
    });
  });
}