var Sequelize = require('sequelize');
var sequelize = require('./models.js');
var KPI = require('./kpi.js');

const KPI_VALUE = sequelize.define('KPI_VALUE', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    //kpi: { type: Sequelize.INTEGER, field: 'id_kpi', references: { model: KPI, key: 'id' }, unique: 'compositeKpiValueKey' },
    date: { type: Sequelize.DATE },
    value: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0.0 },
    weight: {
        type: Sequelize.DOUBLE, allowNull: false, defaultValue: 1.0,
        validate: {
            isPositive(value) {
                if (value <= 0.0) {
                    throw new Error("Weight must be bigger than zero!");
                }
            }
        }
    }
});

KPI.hasMany(KPI_VALUE, {
    foreignKey: 'id_kpi',
    as: 'kpiValues'
})

KPI_VALUE.sync();

KPI.prototype.getPeriod = function (start, end, callback) {
    if (!start || !end)
        throw new Error();

    return KPI.findAll(
        {
            where: {
                id: this.id,
            },
            include:
            [
                {
                    model: KPI_VALUE,
                    as: 'kpiValues',
                    where: {
                        date: {
                            $and: {
                                $gte: start,
                                $lte: end
                            }
                        }
                    },
                    order: 'date',
                    required: false
                }
            ]
        }
    ).catch().then(result => {
        console.log(result);
        if (result)
            callback(result[0].kpiValues);
        else
            callback([]);
    });
}

module.exports = KPI_VALUE;