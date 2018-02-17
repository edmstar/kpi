var utils = require('../utils.js');
var ConsolidateService = require('./consolidate.js');
var KPIService = require('./kpi.js');
var self;

function ReportService(sequelize) {
    this.consolidateService = new ConsolidateService(sequelize);
    this.kpiService = new KPIService(sequelize);
    self = this;
};

ReportService.ERROR_INVALID_ARGUMENTS = "Invalid arguments";
ReportService.ERROR_INVALID_TARGET_TYPE = "Invalid target type";
ReportService.ERROR_INVALID_FREQUENCY_TYPE = "Invalid frequency type";
ReportService.ERROR_INVALID_KPI = "Invalid KPI";

ReportService.prototype.getKpiReport = function(options) {
    self.parseOptions(options);

    let kpiReport = {
        results: null,
        target: null,
        targetMin: null,
        targetMax: null
    };
    let marginsProcessed = 0;

    let getTargetsReport = function(reportResults) {
        // process target
        return self.processTarget(options).then((result) => {
            options.target = result;

            return Promise.all([
                self.processTargetMin, // process min
                self.processTargetMax  // process max
            ].map(async func => func(options))).then((targets) => {
                kpiReport.targetMin = targets[0], //
                kpiReport.targetMax = targets[1],
                kpiReport.results = reportResults;
                kpiReport.target = options.target;

                return kpiReport;
            });// process max
        });
    };

    return self.processKpiValues(options).then(getTargetsReport);
};

ReportService.prototype.processTargetMin = function(options) {
    let reportConfig = {
        targetTypeField: "target_min_type",
        targetConstantField: "target_min",
        targetKpiField: "target_min_kpi",
        options: options
    };

    return self.processTargetConsolidation(reportConfig);
};

ReportService.prototype.processTargetMax = function(options) {
    let reportConfig = {
        targetTypeField: "target_max_type",
        targetConstantField: "target_max",
        targetKpiField: "target_max_kpi",
        options: options
    };

    return self.processTargetConsolidation(reportConfig);
};

ReportService.prototype.processTarget = function(options) {
    let reportConfig = {
        targetTypeField: "target_type",
        targetConstantField: "target",
        targetKpiField: "target_kpi",
        options: options
    };

    return self.processTargetConsolidation(reportConfig);
};

ReportService.prototype.processTargetConsolidation = function(reportConfig) {
    let options = reportConfig.options;

    let targetType = options.kpi[reportConfig.targetTypeField];
    let targetConstant = options.kpi[reportConfig.targetConstantField];
    let targetKpi = options.kpi[reportConfig.targetKpiField];

    // console.log("targetType " + targetType);
    // console.log("targetConstant " + targetConstant);
    // console.log("targetKpi " + targetKpi);

    if (!targetType)
        throw new Error(ReportService.ERROR_INVALID_TARGET_TYPE);

    if (targetType == utils.TARGET_TYPES.CONSTANT) {
        // generate constant values given kpi's consolidation
        var periods = utils.getDateRange(options.start, options.end, options.kpi.frequency);
        for (let period of periods) {
            period.value = targetConstant;
        }

        if (options.kpi.frequency == utils.FREQUENCY_TYPES.NONE) {
            return self.consolidateService.consolidateMultiple(periods, options.start, options.end, options.frequency, options.kpi.consolidationType);
        }

        if (options.frequency > options.kpi.frequency) {
            throw new Error(ReportService.ERROR_INVALID_FREQUENCY_TYPE);
        }

        var consolidatedTarget = self.consolidateService.consolidateMultiple(periods, options.start, options.end, options.kpi.frequency, options.kpi.consolidationType);

        if (options.frequency == options.kpi.frequency)
            return Promise.resolve(consolidatedTarget);

        return Promise.resolve(self.consolidateService.consolidateMultiple(consolidatedTarget, options.start, options.end, options.frequency, options.kpi.consolidationType));

    } else if (targetType == utils.TARGET_TYPES.KPI) {
        return this.processKpiValues({
            start: options.start,
            end: options.end,
            frequency: options.frequency,
            kpi: targetKpi
        });
    } else if (targetType == utils.TARGET_MARGIN_TYPES.PERCENTAGE) {
        if (!options.target)
            throw new Error(ReportService.ERROR_INVALID_TARGET_TYPE);

        let resultValues = [];
        for (let target of options.target) {
            let targetValue = Object.assign({}, target); // makes a copy
            targetValue.value *= targetConstant;
            resultValues.push(targetValue);
        }

        return Promise.resolve(resultValues);
    }

    throw new Error(ReportService.ERROR_INVALID_TARGET_TYPE);
};

/**
 * Returns consolidated KPI report
 * @param {kpi: KPI, kpiName: String, start: Date, end: Date, frequency: utils.FREQUENCY_TYPES} options
 */
ReportService.prototype.processKpiValues = function(options) {
    this.parseOptions(options);

    var processReport = function(values) {
        return self.consolidateService.consolidateMultiple(values, options.start, options.end, options.frequency, options.kpi.consolidationType);
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
        if (options.kpi.frequency !== utils.FREQUENCY_TYPES.NONE && options.frequency > options.kpi.frequency)
            throw new Error(ReportService.ERROR_INVALID_FREQUENCY_TYPE);

        return self.consolidateService.getElementsInPeriod(options.kpi, options.start, options.end).then(processReport);
    };

    var loadKpi = function(returnKpi) {
        if (!returnKpi)
            throw new Error(ReportService.ERROR_INVALID_KPI);

        options.kpi = returnKpi;
        return generateReport();
    };

    // passing a value through options.kpi has higher priority than by name
    // if kpi model is passed, then it should not load it again
    if (options.kpi && options.kpi.id) {
        return generateReport();
    } else if (typeof options.kpi === 'string') {
        return this.kpiService.load(options.kpi).then(loadKpi);
    } else if (typeof options.kpiName === 'string') {
        return this.kpiService.loadByName(options.kpiName).then(loadKpi);
    } else {
        throw new Error(ReportService.ERROR_INVALID_KPI);
    }
};

ReportService.prototype.parseOptions = function(options) {
    // mandatory fields
    if (!options || !(options.kpi || options.kpiName) || !options.start || !options.end)
        throw new Error(ReportService.ERROR_INVALID_ARGUMENTS);
};

module.exports = ReportService;
