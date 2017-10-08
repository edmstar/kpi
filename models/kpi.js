var Sequelize = require('sequelize');
var utils = require('../libs/utils.js');

const TABLE_NAME = 'KPI';
const ERROR_VALIDATION_MULTIPLE_CONSOLIDATION_FREQUENCY = "It is not possible to set a consolidation for multiple values since the frequency is not set.";
const ERROR_VALIDATION_NO_MULTIPLE_CONSOLIDATION_WHEN_WEIGHTED = "It is not possible to set a consolidation for multiple values since the consolidation is weighted.";

module.exports = function(sequelize) {
    if (sequelize.isDefined(TABLE_NAME))
        return sequelize.model(TABLE_NAME);

    var KPI = sequelize.define(TABLE_NAME, {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        format: {
            type: Sequelize.STRING,
            defaultValue: "##,###.00",
            allowNull: false,
            validate: {
                is: /(^\-?[\#\,]+)(\.?[0]{1,11})?\%?$/i
            }
        },
        consolidationType: {
            type: Sequelize.ENUM,
            field: 'consolidation',
            values: utils.consolidationTypes,
            allowNull: false,
            defaultValue: utils.consolidationTypes[0]
        },
        formula: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        frequency: {
            type: Sequelize.ENUM,
            values: utils.frequencyTypes,
            allowNull: true,
            defaultValue: null
        },
        multipleConsolidationType: {
            type: Sequelize.ENUM,
            field: 'multiple_consolidation',
            values: utils.consolidationTypes,
            allowNull: true,
            defaultValue: null,
            validate: {
                isNone(value) {
                    if (this.frequency === null && value !== null) {
                        throw new Error(ERROR_VALIDATION_MULTIPLE_CONSOLIDATION_FREQUENCY);
                    }
                    if (this.consolidationType === utils.CONSOLIDATION_TYPES.WEIGHTED && value !== null) {
                        throw new Error(ERROR_VALIDATION_NO_MULTIPLE_CONSOLIDATION_WHEN_WEIGHTED);
                    }
                }
            }
        },
        target: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: null
        }
    });

    KPI.hasOne(KPI, {
        as: 'Target',
        foreignKey: 'target_kpi',
        allowNull: true,
        defaultValue: null
    });

    return KPI;
};
