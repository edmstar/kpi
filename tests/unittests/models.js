var Sequelize = require('sequelize');
var utils = require('../../libs/utils.js');

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
  var size = 10;
  var days = 10;
  var kpiValues = [];

  for(var i in values) {
    var kpi = values[i];
    var start = new Date('01/01/2000 00:00:00 +00:00');
    var end = utils.getNextDate(start, kpi.dataValues.frequency, days-1);
    var dateRange = utils.getDateRange(start, end, kpi.dataValues.frequency);

    for(var d in dateRange)
    {
      var dateItem = dateRange[d];
      for(var i=0; i<size; i++)
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
  models.loadModels(sequelize, { force: true }, callback);
};