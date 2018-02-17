var Sequelize = require('sequelize');

const sequelize = new Sequelize('kpi', 'admin', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: Sequelize.Op,

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    // SQLite only
    storage: global.appRoot + '/database.sqlite',

    define: {
        freezeTableName: true
    }
  });


// Generate tables
function loadModels(seq, options)
{
  var KPI = require('./kpi.js')(seq);
  var KPI_VALUE = require('./kpi_value.js')(seq);

  exports.KPI = KPI;
  exports.KPI_VALUE = KPI_VALUE;

  return seq.sync(options);
}

exports.sequelize = sequelize;
exports.loadModels = loadModels;
