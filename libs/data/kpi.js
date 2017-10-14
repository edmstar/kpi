var utils = require('../utils.js');
var KPIService = require('../service/kpi.js');
var objectMapper = require('object-mapper');

var mapFromModel = {
    id: {
        key: "id"
    },
    name: {
        key: "name"
    },
    format: {
        key: "format"
    },
    formula: {
        key: "formula"
    },
    consolidationType: {
        key: "consolidationType",
        transform: (value) => {
            return utils.consolidationTypeEnum.getTranslation(value);
        }
    },
    multipleConsolidationType: {
        key: "multipleConsolidationType",
        transform: (value) => {
            return utils.consolidationTypeEnum.getTranslation(value);
        }
    },
    frequency: {
        key: "frequency",
        transform: (value) => {
            return utils.frequencyTypeEnum.getTranslation(value);
        }
    },
    target: {
        key: "target",
        transform: (value, fromObject) => {
            if (fromObject.target_type == utils.TARGET_TYPES.KPI)
                return fromObject.target_kpi;

            return fromObject.target;
        }
    },
    target_min: {
        key: "target_min",
        transform: (value, fromObject) => {
            if (fromObject.target_min_type == utils.TARGET_MARGIN_TYPES.KPI)
                return fromObject.target_min_kpi;

            return fromObject.target_min;
        }
    },
    target_max: {
        key: "target_max",
        transform: (value, fromObject) => {
            if (fromObject.target_max_type == utils.TARGET_MARGIN_TYPES.KPI)
                return fromObject.target_min_kpi;

            return fromObject.target_min;
        }
    },
    target_type: {
        key: "target_type",
        transform: (value) => {
            return utils.targetTypeEnum.getTranslation(value);
        }
    },
    target_min_type: {
        key: "target_min_type",
        transform: (value) => {
            return utils.targetMarginTypeEnum.getTranslation(value);
        }
    },
    target_max_type: {
        key: "target_max_type",
        transform: (value) => {
            return utils.targetMarginTypeEnum.getTranslation(value);
        }
    }
};

var mapToModel = {
    id: {
        key: "id"
    },
    name: {
        key: "name"
    },
    format: {
        key: "format"
    },
    formula: {
        key: "formula"
    },
    consolidationType: {
        key: "consolidationType",
        transform: (value) => {
            return utils.consolidationTypeEnum.getValue(value);
        }
    },
    multipleConsolidationType: {
        key: "multipleConsolidationType",
        transform: (value) => {
            return utils.consolidationTypeEnum.getValue(value);
        }
    },
    frequency: {
        key: "frequency",
        transform: (value) => {
            return utils.frequencyTypeEnum.getValue(value);
        }
    },
    target: [{
            key: "target_kpi",
            transform: (value, fromObject) => {
                if (utils.targetTypeEnum.getValue(fromObject.target_type) == utils.TARGET_TYPES.KPI)
                    return value;

                return null;
            }
        },
        {
            key: "target",
            transform: (value, fromObject) => {
                console.log(fromObject);
                if (utils.targetTypeEnum.getValue(fromObject.target_type) != utils.TARGET_TYPES.KPI)
                    return value;

                return null;
            }
        }
    ],
    target_min: [{
        key: "target_min_kpi",
        transform: (value, fromObject) => {
            if (utils.targetMarginTypeEnum.getValue(fromObject.target_min_type) == utils.TARGET_MARGIN_TYPES.KPI)
                return value;

            return null;
        },
        key: "target_min",
        transform: (value, fromObject) => {
            if (utils.targetMarginTypeEnum.getValue(fromObject.target_min_type) != utils.TARGET_MARGIN_TYPES.KPI)
                return value;

            return null;
        }
    }],
    target_max: [{
        key: "target_max_kpi",
        transform: (value, fromObject) => {
            if (utils.targetMarginTypeEnum.getValue(fromObject.target_max_type) == utils.TARGET_MARGIN_TYPES.KPI)
                return value;

            return null;
        },
        key: "target_max",
        transform: (value, fromObject) => {
            if (utils.targetMarginTypeEnum.getValue(fromObject.target_max_type) != utils.TARGET_MARGIN_TYPES.KPI)
                return value;

            return null;
        }
    }],
    target_type: {
        key: "target_type",
        transform: (value) => {
            return utils.targetTypeEnum.getValue(value);
        }
    },
    target_min_type: {
        key: "target_min_type",
        transform: (value) => {
            return utils.targetMarginTypeEnum.getValue(value);
        }
    },
    target_max_type: {
        key: "target_max_type",
        transform: (value) => {
            return utils.targetMarginTypeEnum.getValue(value);
        }
    }
};

class KPIData {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.service = new KPIService(sequelize);
    }

    load(data, callback, error) {
        var serviceCallback = function(kpi) {
            if (kpi) callback(utils.success(kpi.dataValues));
        };

        this.service.load(data.id, serviceCallback, (errors) => {
            error(utils.error(errors));
        });
    }

    create(data, callback, error) {
        var serviceCallback = function(kpi) {
            if (kpi) {
                var dto = objectMapper(kpi.dataValues, mapFromModel);
                callback(dto);
            }
            // {
            // name: kpi.name,
            // format: kpi.format,
            // consolidationType: utils.consolidationTypeEnum.getTranslation(kpi.consolidationType),
            // formula: kpi.formula,
            // frequency: utils.frequencyTypeEnum.getTranslation(kpi.frequency),
            // multipleConsolidationType: utils.consolidationTypeEnum.getTranslation(kpi.multipleConsolidationType)
            // }
        };

        var dto = objectMapper(data, mapToModel);
        // {
        //     name: data.name || null,
        //     format: data.format || null,
        //     consolidationType: utils.consolidationTypeEnum.getValue(data.consolidationType),
        //     formula: data.formula || null,
        //     frequency: utils.frequencyTypeEnum.getValue(data.frequency),
        //     multipleConsolidationType: utils.consolidationTypeEnum.getValue(data.multipleConsolidationType),
        //     target: utils.targetTypeEnum.getValue(data.target)
        // };
        console.log(dto);
        this.service.create(dto, serviceCallback, (errors) => {
            error(utils.error(errors));
        });
    }

    addValue(data, callback, error) {
        var serviceCallback = function(kpiValue) {
            if (kpiValue) callback(kpiValue.dataValues);
        };

        var dto = {
            date: data.date,
            value: data.value,
            weight: data.weight,
            id_kpi: data.id_kpi
        };

        this.service.addValue(dto, serviceCallback, (errors) => {
            error(utils.error(errors));
        });
    }
}

module.exports = KPIData;
