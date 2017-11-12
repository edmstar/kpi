var utils = require('../utils.js');

class ConsolidateService {
    constructor(sequelize) {
        this.sequelize = sequelize;
    }

    /**
     * Consolidates KPI for the given @start and @end dates. Result is passed to callback.
     * @param {KPI} kpi
     * @param {Date} start
     * @param {Date} end
     * @param {void} callback
     */
    consolidate(kpi, start, end, callback) {
        if (!kpi)
            callback(null);

        var calculate = (function(values) {
            callback(this.consolidateValues(values, kpi.consolidationType));
        }).bind(this);

        this.getElementsInPeriod(kpi, start, end, calculate);
    }

    /**
     * Calculates weighted mean value of {date, value} struct
     * @param  values
     * @param {string} frequency
     * @param {string} consolidation
     */
    consolidateMultiple(values, start, end, frequency, consolidation) {
        var containsFT = utils.frequencyTypeEnum.containsValue(frequency);
        if (isNaN(frequency) || !values || !containsFT)
            return [];

        var periods = utils.getDateRange(start, end, frequency);
        var key;
        var periodValue;

        for(key in periods) {
            periodValue = periods[key];
            periodValue.values = [];
        }

        for (var v in values) {
            var value = values[v];
            for (var p in periods) {
                var period = periods[p];
                var referenceDate = value.date ? value.date : value.start;
                if (period.start.getTime() <= referenceDate.getTime() && period.end.getTime() >= referenceDate.getTime()) {
                    period.values.push({
                        value: value.value
                    });
                    break;
                }
            }
        }

        for(key in periods) {
            periodValue = periods[key];
            periodValue.value = this.consolidateValues(periodValue.values, consolidation);
            delete periodValue.values;
        }

        return periods;
    }

    /**
     * Consolidates value based on @consolidation type
     * @param {[{ date: Date, value: float, weight: float }]} values 
     * @param {string} consolidation
     */
    consolidateValues(values, consolidation) {
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
    }

    /**
     * Calculates mean value of {date, value, weight} struct
     * @param {[{ date: Date, value: float, weight: float }]} values 
     */
    calculateMean(values, count) {
        if (!values || !values.length)
            return null;

        if (count == undefined)
            count = values.length;

        if (!count)
            return null;

        return this.calculateSum(values) / count;
    }

    /**
     * Calculates weighted mean value of {date, value, weight} struct
     * @param {[{ date: Date, value: float, weight: float }]} values 
     */
    calculateWeighted(values) {
        if (!values || !values.length)
            return null;

        var sum = 0.0;
        var sumWeights = 0.0;
        var hasValue = false;

        for (var index in values) {
            var kpivalue = values[index];
            if (!isNaN(kpivalue.value)) {
                hasValue = true;
                sum += kpivalue.value * kpivalue.weight;
                sumWeights += kpivalue.weight;
            }
        }

        return hasValue ? sum / sumWeights : null;
    }

    /**
     * Calculates sum of {date, value, weight} struct
     * @param {[{ date: Date, value: float, weight: float }]} values 
     */
    calculateSum(values) {
        if (!values || !values.length)
            return null;

        var hasValue = false;
        var sum = 0.0;
        for (var index in values) {
            var kpivalue = values[index];
            if (kpivalue.value) {
                sum += kpivalue.value;
                hasValue = true;
            }
        }

        return hasValue ? sum : null;
    }

    /**
     * Calculates minimum value of {date, value, weight} struct
     * @param {[{ date: Date, value: float, weight: float }]} values 
     */
    calculateMin(values) {
        if (!values || !values.length)
            return null;

        var min = values[0].value;
        var hasValue = !isNaN(min);

        for (var index in values) {
            var kpivalue = values[index];
            if (!isNaN(kpivalue.value)) {
                hasValue = true;
                if (kpivalue.value < min)
                    min = kpivalue.value;
            }
        }

        return hasValue ? min : null;
    }

    /**
     * Calculates maximum value of {date, value, weight} struct
     * @param {[{ date: Date, value: float, weight: float }]} values 
     */
    calculateMax(values) {
        if (!values || !values.length)
            return null;

        var max = values[0].value;
        var hasValue = !isNaN(max);

        for (var index in values) {
            var kpivalue = values[index];
            if (!isNaN(kpivalue.value)) {
                hasValue = true;
                if (kpivalue.value > max)
                    max = kpivalue.value;
            }
        }

        return hasValue ? max : null;
    }


    /**
     * KPI object where values will be extracted
     * @param {KPI} kpi
     * @param {Date} start
     * @param {Date} end
     * @param {utils.FREQUENCY_TYPES} frequency
     * @param {utils.FREQUENCY_TYPES} multipleConsolidation
     * @param {void} callback
     */
    getElementsInPeriodByFrequency(kpi, start, end, frequency, multipleConsolidation, callback) {
        if (!kpi) {
            if (callback) callback(null);
            return;
        }

        var roundedStart = start; //utils.dateRoundDown(start, frequency);
        var roundedEnd = end; //utils.dateRoundUp(end, frequency);

        if (frequency == null) {
            kpi.getPeriod(start, end, callback);
            return;
        }

        var dates = utils.getDateRange(roundedStart, roundedEnd, frequency);
        var getValuesCallback = (function(kpiValues) {
            var aggregatedValues = [];

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
            var consolidatedValues = this.mergeDateValues(dates, aggregatedValues);
            if (callback) callback(consolidatedValues);
        }).bind(this);

        kpi.getPeriod(start, end, getValuesCallback);
    }

    /**
     * KPI object where values will be extracted
     * @param {KPI} kpi 
     * @param {Date} start 
     * @param {Date} end 
     * @param {void} callback 
     */
    getElementsInPeriod(kpi, start, end, callback) {
        this.getElementsInPeriodByFrequency(kpi, start, end, kpi.frequency, kpi.multipleConsolidationType, callback);
    }

    /**
     * 
     * @param {[{date: Date, value: float, weight: float}]} empty 
     * @param {[{date: Date, value: float, weight: float}]} data 
     */
    mergeDateValues(empty, data) {
        if (!empty)
            return null;

        var sort = function(a, b) {
            return a.start.getTime() - b.start.getTime();
        };

        var values = empty.slice().sort(sort);
        var dataValues = data.slice().sort(sort);
        var currentPosition = 0;

        for (var index in dataValues) {
            var value = dataValues[index];
            var inserted = false;

            // list is ordered, so we must continue from last insertion
            for (; currentPosition < values.length; currentPosition++) {
                var element = values[currentPosition];
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
    }

}

module.exports = ConsolidateService;
