var Sequelize = require('sequelize');
var utils = require('../../libs/utils.js');
var constants = require('./constants.js');

const sequelize = new Sequelize('kpi', 'admin', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: '/home/eduardo/node/kpi/tests/database.sqlite',

  define: {
    freezeTableName: true
  },

  logging: false
});

var models = require('../../models/models.js');

/**
 *
 * @param {void} callback
 */
function populateKPI(callback) {
  var KPI = require('../../models/kpi.js')(sequelize);
  items = [];

  var frequencyTypes = [utils.FREQUENCY_TYPES.DAY];
  var consolidationTypes = [utils.CONSOLIDATION_TYPES.SUM, utils.CONSOLIDATION_TYPES.MEAN];

  for (var f in frequencyTypes) {
    var frequency = frequencyTypes[f];
    for (var c in consolidationTypes) {
      var consolidation = consolidationTypes[c];
      items.push({ name: "KPI|" + consolidation + "|" + frequency, consolidationType: consolidation, frequency: frequency, multipleConsolidationType: utils.CONSOLIDATION_TYPES.SUM });
    }
  }

  KPI.bulkCreate(items).then(() => {
    KPI.findAll().then((values) => {
        populateKPIValues(values, callback);
      }
    );
  });
}

/**
 *
 * @param {KPI} options
 * @param {void} callback
 */
function populateKPIValues(values, callback) {
  var KPI_VALUE = require('../../models/kpi_value.js')(sequelize); 
  var kpiValues = [];

  for(var i in values) {
    var kpi = values[i];
    var start = constants.startDate;
    var end = utils.getNextDate(start, kpi.frequency, constants.days-1);
    var dateRange = utils.getDateRange(start, end, kpi.frequency);

    for(var d in dateRange)
    {
      var dateItem = dateRange[d];
      for(var i=0; i<constants.size; i++)
      {
        kpiValues.push({ id_kpi: kpi.id, date: dateItem.date, value: 1 });
      }
    }
    
  }

  KPI_VALUE.bulkCreate(kpiValues).then(callback);
}

exports.populate = function (callback) {
  populateKPI(callback);
};

exports.sequelize = sequelize;
exports.resetModels = function (callback) {
  models.loadModels(sequelize, { force: true }, function()
  {
    exports.KPI = models.KPI;
    exports.KPI_VALUE = models.KPI_VALUE;

    callback();
  });
};