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

const KPI = sequelize.define('KPI', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    format: { type: Sequelize.STRING, defaultValue: "##,###.00", allowNull: false, validate: { is: /(^\-?[\#\,]+)(\.?[0]{1,11})?\%?$/i }}
});

const KPI_VALUE = sequelize.define('KPI_VALUE', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    kpi: { type: Sequelize.INTEGER, field: 'id_kpi', references: { model: KPI, key: 'Id'}, unique: 'compositeKpiValueKey' },
    date: { type: Sequelize.DATE, unique: 'compositeKpiValueKey' },
    value: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 }
});

//sequelize.sync();

exports.KPI = KPI;
exports.KPI_VALUE = KPI_VALUE;