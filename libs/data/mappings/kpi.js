var utils = require('../../utils.js');

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
                return fromObject.target_max_kpi;

            return fromObject.target_max;
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

exports.mapToModel = mapToModel;
exports.mapFromModel = mapFromModel;
