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
  }
});

var models = require('../../models/models.js');

exports.sequelize = sequelize;
exports.resetModels = function (callback) {
  models.loadModels(sequelize, { force: true }, callback);
}

exports.populate = function (callback) {
  var KPI = require('../../models/kpi.js')(sequelize);
  var KPI_VALUE = require('../../models/kpi_value.js')(sequelize);
  items = [];

  for (f in utils.frequencyTypes) {
    frequency = utils.frequencyTypes[f];
    for (c in utils.consolidationTypes) {
      consolidation = utils.consolidationTypes[c];
      items.push({ name: "KPI|" + consolidation + "|" + frequency, consolidationType: consolidation, frequency: frequency });
    }
  }

  KPI.bulkCreate(items).then(callback);
}
