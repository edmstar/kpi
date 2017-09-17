var Sequelize = require('sequelize');
var sequelize = require('./models.js');

var frequencyTypes = ['year', 'semester', 'month', 'week', 'day', 'hour', 'minute', 'second'];
var consolidationTypes = ['mean', 'weighted', 'sum', 'min', 'max', 'formula'];

const ERROR_VALIDATION_MULTIPLE_CONSOLIDATION = "It is not possible to set a consolidation for multiple values since the frequency is not set.";

const KPI = sequelize.define('KPI', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false, unique: true },
    format: { type: Sequelize.STRING, defaultValue: "##,###.00", allowNull: false, validate: { is: /(^\-?[\#\,]+)(\.?[0]{1,11})?\%?$/i } },
    consolidationType: { type: Sequelize.ENUM, field: 'consolidation', values: consolidationTypes, allowNull: false, defaultValue: consolidationTypes[0] },
    formula: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    frequency: { type: Sequelize.ENUM, values: frequencyTypes, allowNull: true, defaultValue: null },
    multipleConsolidationType: { type: Sequelize.ENUM, field: 'multiple_consolidation', values: consolidationTypes, allowNull: true, defaultValue: null,
        validate:
        {
            isNone(value)
            {
                if (this.frequency === null && value !== null)
                {
                    throw new Error(ERROR_VALIDATION_MULTIPLE_CONSOLIDATION);
                }
            }
        }
    },
    target: { type: Sequelize.DOUBLE, allowNull: true, defaultValue: null }
});

KPI.hasOne(KPI, { as: 'Target', foreignKey: 'target_kpi', allowNull: true, defaultValue: null } );

KPI.sync();

module.exports = KPI;