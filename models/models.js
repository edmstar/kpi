var Sequelize = require('sequelize');

const sequelize = new Sequelize('kpi', 'admin', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  
    // SQLite only
    storage: '/home/eduardo/node/kpi/database.sqlite',

    define: {
        freezeTableName: true
    }
  });


// Generate tables
function loadModels(seq, options, callback)
{
  var KPI = require('./kpi.js')(seq);
  var KPI_VALUE = require('./kpi_value.js')(seq);

  seq.sync(options).then(callback);
}

exports.sequelize = sequelize;
exports.loadModels = loadModels;