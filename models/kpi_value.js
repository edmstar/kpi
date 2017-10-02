var Sequelize = require('sequelize');
const tableName = 'KPI_VALUE';

module.exports = function(sequelize)
{
    var KPI = require('./kpi.js')(sequelize);

    if (sequelize.isDefined(tableName))
        return sequelize.model(tableName);

    var KPI_VALUE = sequelize.define(tableName, {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
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
            //console.log(result);
            if (result)
                callback(result[0].kpiValues);
            else
                callback([]);
        });
    }

    return KPI_VALUE;
}