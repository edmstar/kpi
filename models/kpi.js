var Sequelize = require('sequelize');
var utils = require('../libs/utils.js');

const TABLE_NAME = 'KPI';
const ERROR_VALIDATION_MULTIPLE_CONSOLIDATION_FREQUENCY = "It is not possible to set a consolidation for multiple values since the frequency is not set.";
const ERROR_VALIDATION_NO_MULTIPLE_CONSOLIDATION_WHEN_WEIGHTED = "It is not possible to set a consolidation for multiple values since the consolidation is weighted.";
const ERROR_TARGET_MARGIN_KPI_NULL = "Margin KPI not selected.";
const ERROR_TARGET_MARGIN_CONSTANT_NULL = "Margin value not specified.";

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
            defaultValue: null,
            allowNull: true,
            validate: {
                is: /(^\-?[\#\,]+)(\.?[0]{1,11})?\%?$/i
            }
        },
        consolidationType: {
            type: Sequelize.ENUM,
            field: 'consolidation',
            values: utils.consolidationTypeEnum.getTypes(),
            allowNull: false,
            defaultValue: utils.CONSOLIDATION_TYPES.MEAN
        },
        formula: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null
        },
        frequency: {
            type: Sequelize.ENUM,
            values: utils.frequencyTypeEnum.getTypes(),
            allowNull: true,
            defaultValue: null
        },
        multipleConsolidationType: {
            type: Sequelize.ENUM,
            field: 'multiple_consolidation',
            values: utils.consolidationTypeEnum.getTypes(),
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
        target_type: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: null
        },
        target: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: null
        },
        target_min_type: {
            type: Sequelize.ENUM,
            allowNull: true,
            defaultValue: utils.TARGET_MARGIN_TYPES.NONE,
            values: utils.targetTypeEnum.getTypes()
        },
        target_min: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: null,
            validate: {
                isConstantOrPercentage(value) {
                    if ((this.target_min_type === utils.TARGET_MARGIN_TYPES.CONSTANT || this.target_min_type === utils.TARGET_MARGIN_TYPES.PERCENTAGE) && value === null)
                        throw new Error(ERROR_TARGET_MARGIN_CONSTANT_NULL);
                }
            }
        },
        target_max_type: {
            type: Sequelize.ENUM,
            allowNull: true,
            defaultValue: utils.TARGET_MARGIN_TYPES.NONE,
            values: utils.targetTypeEnum.getTypes()
        },
        target_max: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: null,
            validate: {
                isConstantOrPercentage(value) {
                    if ((this.target_max_type === utils.TARGET_MARGIN_TYPES.CONSTANT || this.target_max_type === utils.TARGET_MARGIN_TYPES.PERCENTAGE) && value === null)
                        throw new Error(ERROR_TARGET_MARGIN_CONSTANT_NULL);
                }
            }
        }
    });

    KPI.hasOne(KPI, {
        as: 'Target',
        foreignKey: 'target_kpi',
        allowNull: true,
        defaultValue: null,
        validate: {
            isKPI(value) {
                if (this.target_type === utils.TARGET_TYPES.KPI && value === null)
                    throw new Error(ERROR_TARGET_KPI_NULL);
            }
        }
    });

    KPI.hasOne(KPI, {
        as: 'TargetMin',
        foreignKey: 'target_min_kpi',
        allowNull: true,
        defaultValue: null,
        validate: {
            isKPI(value) {
                if (this.target_min_type === utils.TARGET_MARGIN_TYPES.KPI && value === null)
                    throw new Error(ERROR_TARGET_MARGIN_KPI_NULL);
            }
        }
    });

    KPI.hasOne(KPI, {
        as: 'TargetMax',
        foreignKey: 'target_max_kpi',
        allowNull: true,
        defaultValue: null,
        validate: {
            isKPI(value) {
                if (this.target_max_type === utils.TARGET_MARGIN_TYPES.KPI && value === null)
                    throw new Error(ERROR_TARGET_MARGIN_KPI_NULL);
            }
        }
    });

    return KPI;
};
