var Sequelize = require('sequelize');
var sequelize = require('./models.js');
var KPI = require('./kpi.js');

const KPI_VALUE = sequelize.define('KPI_VALUE', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    kpi: { type: Sequelize.INTEGER, field: 'id_kpi', references: { model: KPI, key: 'id' }, unique: 'compositeKpiValueKey' },
    date: { type: Sequelize.DATE, unique: 'compositeKpiValueKey' },
    value: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    weight: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 1.0,
        validate : {
            isPositive(value)
            {
                if (value <= 0.0)
                {
                    throw new Error("Weight must be bigger than zero!");
                }
            }
        } 
    }
});

module.exports = KPI_VALUE;