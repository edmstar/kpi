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

module.exports = sequelize;