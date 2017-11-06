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
        var kpiReport;

        this.processKpiValues(options, function(result) {
            kpiReport = result;
            callback(result);
        });
    }


    processTarget(options, callback) {
        var targetType = options.kpi.target_type;

        if(targetType === utils.TARGET_TYPES.CONSTANT) {
            // generate constant values given kpi's consolidation
            var periods = utils.getDateRange(options.start, options.end, options.kpi.frequency);
            periods.forEach(function(period) {
                period.value = options.kpi.target;
            });

            var consolidatedTarget = self.consolidateService.consolidateMultiple(periods, options.start, options.end, options.kpi.frequency, options.kpi.consolidationType);

            if (options.frequency > options.kpi.frequency)
                callback(null);
            else if (options.frequency === options.kpi.frequency)
                callback(consolidatedTarget);
            else
                callback(self.consolidateService.consolidateMultiple(consolidatedTarget, options.start, options.end, options.frequency, options.kpi.consolidationType));

        } else if(targetType === utils.TARGET_TYPES.KPI) {
            this.processKpiValues({
                start: options.start,
                end: options.end,
                frequency: options.frequency,
                kpi: options.kpi.target_kpi
            }, callback);
        } else if(targetType === utils.TARGET_MARGIN_TYPES.PERCENTAGE) {
            if (!options.targetValues || !options.marginPercentage) {
                callback(null);
                return;
            }
            var targetValues = Object.assign({}, options.targetValues); // makes a copy
            targetValues.forEach(function(targetValue) {
                targetValue.value *= options.marginPercentage;
            });

            callback(targetValues);
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
            if (options.frequency > options.kpi.frequency) {
                callback(null);
                return;
            }

            // console.log("Frequency: " + frequency + " - " + utils.frequencyTypeEnum.getTranslation(frequency));
            // console.log("Start: " + options.start + " - End: " + options.end);
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
