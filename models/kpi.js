var Sequelize = require('sequelize');
var utils = require('../libs/utils.js');

const tableName = 'KPI';
const ERROR_VALIDATION_MULTIPLE_CONSOLIDATION = "It is not possible to set a consolidation for multiple values since the frequency is not set.";

module.exports = function(sequelize)
{
    if (sequelize.isDefined(tableName))
        return sequelize.model(tableName);

    var KPI = sequelize.define('KPI', {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
        name: { type: Sequelize.STRING, allowNull: false, unique: true },
        format: { type: Sequelize.STRING, defaultValue: "##,###.00", allowNull: false, validate: { is: /(^\-?[\#\,]+)(\.?[0]{1,11})?\%?$/i } },
        consolidationType: { type: Sequelize.ENUM, field: 'consolidation', values: utils.consolidationTypes, allowNull: false, defaultValue: utils.consolidationTypes[0] },
        formula: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
        frequency: { type: Sequelize.ENUM, values: utils.frequencyTypes, allowNull: true, defaultValue: null },
        multipleConsolidationType: {
            type: Sequelize.ENUM, field: 'multiple_consolidation', values: utils.consolidationTypes, allowNull: true, defaultValue: null,
            validate:
            {
                isNone(value) {
                    if (this.frequency === null && value !== null) {
                        throw new Error(ERROR_VALIDATION_MULTIPLE_CONSOLIDATION);
                    }
                }
            }
        },
        target: { type: Sequelize.DOUBLE, allowNull: true, defaultValue: null }
    });

    KPI.hasOne(KPI, { as: 'Target', foreignKey: 'target_kpi', allowNull: true, defaultValue: null });

    return KPI;
};