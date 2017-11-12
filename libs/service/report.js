var utils = require('../utils.js');
var ConsolidateService = require('./consolidate.js');
var KPIService = require('./kpi.js');
var self;

class ReportService {
    constructor(sequelize) {
        this.consolidateService = new ConsolidateService(sequelize);
        this.kpiService = new KPIService(sequelize);
        self = this;
    }

    getKpiReport(options, callback) {
        var kpiReport = {
            results: null,
            target: null,
            targetMin: null,
            targetMax: null
        };
        var marginsProcessed = 0;

        var getTargetsReport = function() {
            var processMarginsReport = function(marginType) {
                return function(result) {
                    if (marginType == "min") {
                        options.targetMin = result;
                    } else if (marginType == "max") {
                        options.targetMax = result;
                    }

                    marginsProcessed++;
                    if (marginsProcessed == 2) { // min and max
                        kpiReport.results = options.results;
                        kpiReport.target = options.target;
                        kpiReport.targetMin = options.targetMin;
                        kpiReport.targetMax = options.targetMax;

                        callback(kpiReport);
                    }
                };
            };

            // process target
            self.processTarget(options, function(result) {
                options.target = result;
                self.processTargetMin(options, processMarginsReport("min")); // process min
                self.processTargetMax(options, processMarginsReport("max")); // process min
            });
        };

        this.processKpiValues(options, function(result) {
            options.results = result;
            getTargetsReport();
        });
    }

    processTargetMin(options, callback) {
        var reportConfig = {};

        reportConfig.targetTypeField = "target_min_type";
        reportConfig.targetConstantField = "target_min";
        reportConfig.targetKpiField = "target_min_kpi";
        reportConfig.options = options;

        self.processTargetConsolidation(reportConfig, callback);
    }

    processTargetMax(options, callback) {
        var reportConfig = {};

        reportConfig.targetTypeField = "target_max_type";
        reportConfig.targetConstantField = "target_max";
        reportConfig.targetKpiField = "target_max_kpi";
        reportConfig.options = options;

        self.processTargetConsolidation(reportConfig, callback);
    }

    processTarget(options, callback) {
        var reportConfig = {};

        reportConfig.targetTypeField = "target_type";
        reportConfig.targetConstantField = "target";
        reportConfig.targetKpiField = "target_kpi";
        reportConfig.options = options;

        self.processTargetConsolidation(reportConfig, callback);
    }

    processTargetConsolidation(reportConfig, callback) {
        var options = reportConfig.options;

        var targetType = options.kpi[reportConfig.targetTypeField];
        var targetConstant = options.kpi[reportConfig.targetConstantField];
        var targetKpi = options.kpi[reportConfig.targetKpiField];

        // console.log("targetType " + targetType);
        // console.log("targetConstant " + targetConstant);
        // console.log("targetKpi " + targetKpi);

        if (!targetType) {
            callback(null);
            return;
        }

        if (targetType == utils.TARGET_TYPES.CONSTANT) {
            // generate constant values given kpi's consolidation
            var periods = utils.getDateRange(options.start, options.end, options.kpi.frequency);
            periods.forEach(function(period) {
                period.value = targetConstant;
            });

            if (options.kpi.frequency == utils.FREQUENCY_TYPES.NONE) {
                callback(self.consolidateService.consolidateMultiple(periods, options.start, options.end, options.frequency, options.kpi.consolidationType));
                return;
            }

            if (options.frequency > options.kpi.frequency) {
                callback(null);
                return;
            }

            var consolidatedTarget = self.consolidateService.consolidateMultiple(periods, options.start, options.end, options.kpi.frequency, options.kpi.consolidationType);

            if (options.frequency == options.kpi.frequency)
                callback(consolidatedTarget);
            else
                callback(self.consolidateService.consolidateMultiple(consolidatedTarget, options.start, options.end, options.frequency, options.kpi.consolidationType));

        } else if (targetType == utils.TARGET_TYPES.KPI) {
            this.processKpiValues({
                start: options.start,
                end: options.end,
                frequency: options.frequency,
                kpi: targetKpi
            }, callback);
        } else if (targetType == utils.TARGET_MARGIN_TYPES.PERCENTAGE) {
            if (!options.target) {
                callback(null);
                return;
            }
            var resultValues = [];
            for (var key in options.target) {
                var targetValue = Object.assign({}, options.target[key]); // makes a copy
                targetValue.value *= targetConstant;
                resultValues.push(targetValue);
            }

            callback(resultValues);
        } else {
            callback(null);
        }
    }

    /**
     * Returns consolidated KPI report
     * @param {kpi: KPI, kpiName: String, start: Date, end: Date, frequency: utils.FREQUENCY_TYPES} options
     */
    processKpiValues(options, callback) {
        if (!this.parseOptions(options)) {
            callback(null);
            return;
        }

        var processReport = function(values) {
            var periodReport = self.consolidateService.consolidateMultiple(values, options.start, options.end, options.frequency, options.kpi.consolidationType);

            callback(periodReport);
        };

        var generateReport = function() {
            // if not specified, the default frequency is the kpi's frequency
            // null can be a frequency type (FREQUENCY_TYPES.NONE) so we should
            // exclude this option by checking the variable first
            if (isNaN(options.frequency) || !utils.frequencyTypeEnum.containsValue(options.frequency))
                options.frequency = options.kpi.frequency;

            // the report frequency should be smaller than the kpi frequency
            // i.e. it is not possible to generate a report for each minute
            // once the KPI has a daily frequency
            if (options.kpi.frequency !== utils.FREQUENCY_TYPES.NONE && options.frequency > options.kpi.frequency) {
                callback(null);
                return;
            }

            self.consolidateService.getElementsInPeriod(options.kpi, options.start, options.end, processReport);
        };

        var loadKpi = function(returnKpi, errorMessage) {
            if (!returnKpi || errorMessage) {
                callback(null);
            }

            options.kpi = returnKpi;
            generateReport();
        };

        // passing a value through options.kpi has higher priority than by name
        // if kpi model is passed, then it should not load it again
        if (options.kpi instanceof KPIService) {
            generateReport();
        } else if (typeof options.kpi === 'string') {
            this.kpiService.load(options.kpi, loadKpi);
        } else if (typeof options.kpiName === 'string') {
            this.kpiService.loadByName(options.kpiName, loadKpi);
        }
    }

    parseOptions(options) {
        // mandatory fields
        if (!options || !(options.kpi || options.kpiName) || !options.start || !options.end) {
            return false;
        }

        return true;
    }
}

module.exports = ReportService;
