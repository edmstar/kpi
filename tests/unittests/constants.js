var utils = require('../../libs/utils.js');

module.exports = {
    startDate: new Date('01/01/2000 00:00:00 +00:00'),
    days: 10,
    size: 10,
    kpis: {
        KPI1: {
            name: "KPI1",
            format: null,
            consolidationType: utils.CONSOLIDATION_TYPES.SUM,
            formula: null,
            frequency: utils.FREQUENCY_TYPES.DAY,
            multipleConsolidationType: utils.CONSOLIDATION_TYPES.SUM,
            target_type: utils.TARGET_TYPES.NONE,
            target: null,
            target_min_type: utils.TARGET_MARGIN_TYPES.NONE,
            target_min: null,
            target_max_type: utils.TARGET_MARGIN_TYPES.NONE,
            target_max: null,
            target_kpi: null,
            target_min_kpi: null,
            target_max_kpi: null
        },
        KPI2: {
            name: "KPI2",
            format: null,
            consolidationType: utils.CONSOLIDATION_TYPES.SUM,
            formula: null,
            frequency: utils.FREQUENCY_TYPES.DAY,
            multipleConsolidationType: utils.CONSOLIDATION_TYPES.SUM,
            target_type: utils.TARGET_TYPES.NONE,
            target: null,
            target_min_type: utils.TARGET_MARGIN_TYPES.NONE,
            target_min: null,
            target_max_type: utils.TARGET_MARGIN_TYPES.NONE,
            target_max: null,
            target_kpi: null,
            target_min_kpi: null,
            target_max_kpi: null
        }
    }
}
