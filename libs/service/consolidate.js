const utils = require('../utils.js');
let self;

function ConsolidateService(sequelize) {
    this.sequelize = sequelize;
    self = this;
};

ConsolidateService.ERROR_INVALID_KPI = "Invalid KPI";

/**
 * Consolidates KPI for the given @start and @end dates. Result is passed to callback.
 * @param {KPI} kpi
 * @param {Date} start
 * @param {Date} end
 * @param {void} callback
 */
ConsolidateService.prototype.consolidate = function(kpi, start, end) {
    if (!kpi)
        throw new Error(ConsolidateService.ERROR_INVALID_KPI);

    return this.getElementsInPeriod(kpi, start, end).then((values) => this.consolidateValues(values, kpi.consolidationType));
};

/**
 * Calculates weighted mean value of {date, value} struct
 * @param  values
 * @param {string} frequency
 * @param {string} consolidation
 */
ConsolidateService.prototype.consolidateMultiple = function(values, start, end, frequency, consolidation) {
    let containsFT = utils.frequencyTypeEnum.containsValue(frequency);
    if (isNaN(frequency) || !values || !containsFT)
        return [];

    let periods = utils.getDateRange(start, end, frequency);
    let periodValue;

    periods.forEach((periodValue) => { periodValue.values = []; });

    for (let value of values) {
        for (let period of periods) {
            let referenceDate = value.date ? value.date : value.start;
            if (period.start.getTime() <= referenceDate.getTime() && period.end.getTime() >= referenceDate.getTime()) {
                period.values.push({
                    value: value.value
                });
                break;
            }
        }
    }

    for (let periodValue of periods) {
        periodValue.value = this.consolidateValues(periodValue.values, consolidation);
        delete periodValue.values;
    }

    return periods;
};

/**
 * Consolidates value based on @consolidation type
 * @param {[{ date: Date, value: float, weight: float }]} values 
 * @param {string} consolidation
 */
ConsolidateService.prototype.consolidateValues = function(values, consolidation) {
    if (!values)
        return null;

    switch (parseInt(consolidation)) {
        case utils.CONSOLIDATION_TYPES.MEAN:
            return this.calculateMean(values);
        case utils.CONSOLIDATION_TYPES.WEIGHTED:
            return this.calculateWeighted(values);
        case utils.CONSOLIDATION_TYPES.SUM:
            return this.calculateSum(values);
        case utils.CONSOLIDATION_TYPES.MIN:
            return this.calculateMin(values);
        case utils.CONSOLIDATION_TYPES.MAX:
            return this.calculateMax(values);
    }
    return null;
};

/**
 * Calculates mean value of {date, value, weight} struct
 * @param {[{ date: Date, value: float, weight: float }]} values 
 */
ConsolidateService.prototype.calculateMean = function(values, count) {
    if (!values || !values.length)
        return null;

    if (count == undefined)
        count = values.length;

    if (!count)
        return null;

    return this.calculateSum(values) / count;
};

/**
 * Calculates weighted mean value of {date, value, weight} struct
 * @param {[{ date: Date, value: float, weight: float }]} values 
 */
ConsolidateService.prototype.calculateWeighted = function(values) {
    if (!values || !values.length)
        return null;

    let sum = 0.0;
    let sumWeights = 0.0;
    let hasValue = false;

    for (let kpiValue of values) {
        if (!isNaN(kpiValue.value)) {
            hasValue = true;
            sum += kpiValue.value * kpiValue.weight;
            sumWeights += kpiValue.weight;
        }
    }

    return hasValue ? sum / sumWeights : null;
};

/**
 * Calculates sum of {date, value, weight} struct
 * @param {[{ date: Date, value: float, weight: float }]} values 
 */
ConsolidateService.prototype.calculateSum = function(values) {
    if (!values || !values.length)
        return null;

    let hasValue = false;
    let sum = 0.0;
    for (let kpiValue of values) {
        if (kpiValue.value) {
            sum += kpiValue.value;
            hasValue = true;
        }
    }

    return hasValue ? sum : null;
};

/**
 * Calculates minimum value of {date, value, weight} struct
 * @param {[{ date: Date, value: float, weight: float }]} values 
 */
ConsolidateService.prototype.calculateMin = function(values) {
    if (!values || !values.length)
        return null;

    let min = values[0].value;
    let hasValue = !isNaN(min);

    for (let kpiValue of values) {
        if (!isNaN(kpiValue.value)) {
            hasValue = true;
            if (kpiValue.value < min)
                min = kpiValue.value;
        }
    }

    return hasValue ? min : null;
};

/**
 * Calculates maximum value of {date, value, weight} struct
 * @param {[{ date: Date, value: float, weight: float }]} values 
 */
ConsolidateService.prototype.calculateMax = function(values) {
    if (!values || !values.length)
        return null;

    let max = values[0].value;
    let hasValue = !isNaN(max);

    for (let kpiValue of values) {
        if (!isNaN(kpiValue.value)) {
            hasValue = true;
            if (kpiValue.value > max)
                max = kpiValue.value;
        }
    }

    return hasValue ? max : null;
};


/**
 * KPI object where values will be extracted
 * @param {KPI} kpi
 * @param {Date} start
 * @param {Date} end
 * @param {utils.FREQUENCY_TYPES} frequency
 * @param {utils.FREQUENCY_TYPES} multipleConsolidation
 * @param {void} callback
 */
ConsolidateService.prototype.getElementsInPeriodByFrequency = function(kpi, start, end, frequency, multipleConsolidation) {
    if (!kpi)
        throw new Error(ConsolidateService.ERROR_INVALID_KPI);

    let roundedStart = start; //utils.dateRoundDown(start, frequency);
    let roundedEnd = end; //utils.dateRoundUp(end, frequency);

    if (frequency == null)
        return kpi.getPeriod(start, end);

    let dates = utils.getDateRange(roundedStart, roundedEnd, frequency);

    return kpi.getPeriod(start, end).then((kpiValues) => {
        let aggregatedValues = [];

        // aggregate by multipleConsolidation type
        if (multipleConsolidation) {
            aggregatedValues = this.consolidateMultiple(kpiValues, start, end, frequency, multipleConsolidation);

            if (aggregatedValues && aggregatedValues.length > 0) {
                aggregatedValues[0].start = start;
                aggregatedValues[aggregatedValues.length - 1].end = end;
            }
        } else {
            aggregatedValues = kpiValues; //this.consolidateMultiple(kpiValues, frequency, kpi.consolidationType);
        }

        // merge values from empty date array
        let consolidatedValues = this.mergeDateValues(dates, aggregatedValues);
        return Promise.resolve(consolidatedValues);
    });
};

/**
 * KPI object where values will be extracted
 * @param {KPI} kpi 
 * @param {Date} start 
 * @param {Date} end 
 * @param {void} callback 
 */
ConsolidateService.prototype.getElementsInPeriod = function(kpi, start, end) {
    return this.getElementsInPeriodByFrequency(kpi, start, end, kpi.frequency, kpi.multipleConsolidationType);
};

/**
 * 
 * @param {[{date: Date, value: float, weight: float}]} empty 
 * @param {[{date: Date, value: float, weight: float}]} data 
 */
ConsolidateService.prototype.mergeDateValues = function(empty, data) {
    if (!empty)
        return null;

    let sort = function(a, b) {
        return a.start.getTime() - b.start.getTime();
    };

    let values = empty.slice().sort(sort);
    let dataValues = data.slice().sort(sort);
    let currentPosition = 0;

    for (let index in dataValues) {
        let value = dataValues[index];
        let inserted = false;

        // list is ordered, so we must continue from last insertion
        for (; currentPosition < values.length; currentPosition++) {
            let element = values[currentPosition];
            if (element.start.getTime() == value.start.getTime() && element.end.getTime() == value.end.getTime()) {
                values.splice(currentPosition, 1, {
                    start: value.start,
                    end: value.end,
                    value: value.value,
                    weight: value.weight
                });
                currentPosition++;
                inserted = true;
                break;
            } else if (element.start.getTime() > value.start.getTime()) {
                values.splice(currentPosition, 0, {
                    start: value.start,
                    end: value.end,
                    value: value.value,
                    weight: value.weight
                });
                inserted = true;
                currentPosition++;
                break;
            }
        }

        if (!inserted && currentPosition >= values.length) {
            values = values.concat(dataValues.slice(index));
            break;
        }
    }

    return values;
};


module.exports = ConsolidateService;
