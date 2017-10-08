var utils = require('../utils.js');

class ConsolidateService {
    constructor(sequelize) {

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
    consolidateMultiple(values, frequency, consolidation) {
        var containsFT = utils.containsFrequencyType(frequency);
        if (!frequency || !values || !containsFT)
            return [];

        var mappedValues = new Map();
        for (var index in values) {
            var value = values[index];
            var referenceDate = utils.dateRoundDown(value.date, frequency);
            var dateValue = mappedValues.get(referenceDate.getTime());
            if (!dateValue) {
                dateValue = {
                    date: referenceDate,
                    values: [],
                    weights: []
                };
                mappedValues.set(referenceDate.getTime(), dateValue);
            }
            dateValue.values.push({
                date: dateValue.date,
                value: value.value,
                weight: value.weight
            });
        }

        var consolidatedValues = [];

        mappedValues.forEach((function(mappedValue) {
            var consolidationData = [];
            consolidatedValues.push({
                date: mappedValue.date,
                value: this.consolidateValues(mappedValue.values, consolidation)
            });
        }).bind(this));

        return consolidatedValues;
    }

    /**
     * Consolidates value based on @consolidation type
     * @param {[{ date: Date, value: float, weight: float }]} values 
     * @param {string} consolidation
     */
    consolidateValues(values, consolidation) {
        if (!values)
            return null;

        switch (consolidation) {
            case 'mean':
                return this.calculateMean(values);
            case 'weighted':
                return this.calculateWeighted(values);
            case 'sum':
                return this.calculateSum(values);
            case 'min':
                return this.calculateMin(values);
            case 'max':
                return this.calculateMax(values);
        }
        return result;
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

        for (var index in values) {
            var kpivalue = values[index];
            if (kpivalue.value) {
                sum += kpivalue.value * kpivalue.weight;
                sumWeights += kpivalue.weight;
            }
        }

        return sum / sumWeights;
    }

    /**
     * Calculates sum of {date, value, weight} struct
     * @param {[{ date: Date, value: float, weight: float }]} values 
     */
    calculateSum(values) {
        if (!values || !values.length)
            return null;

        var sum = 0.0;
        for (var index in values) {
            var kpivalue = values[index];
            if (kpivalue.value)
                sum += kpivalue.value;
        }

        return sum;
    }

    /**
     * Calculates minimum value of {date, value, weight} struct
     * @param {[{ date: Date, value: float, weight: float }]} values 
     */
    calculateMin(values) {
        if (!values || !values.length)
            return null;

        var min = values[0].value;
        for (var index in values) {
            var kpivalue = values[index];
            if (kpivalue.value && kpivalue.value < min)
                min = kpivalue.value;
        }

        return min;
    }

    /**
     * Calculates maximum value of {date, value, weight} struct
     * @param {[{ date: Date, value: float, weight: float }]} values 
     */
    calculateMax(values) {
        if (!values || !values.length)
            return null;

        var max = values[0].value;
        for (var index in values) {
            var kpivalue = values[index];
            if (kpivalue.value && kpivalue.value > max)
                max = kpivalue.value;
        }

        return max;
    }

    /**
     * KPI object where values will be extracted
     * @param {KPI} kpi 
     * @param {Date} start 
     * @param {Date} end 
     * @param {void} callback 
     */
    getElementsInPeriod(kpi, start, end, callback) {
        if (!kpi) {
            if (callback) callback(null);
            return;
        }

        var roundedStart = utils.dateRoundDown(start, kpi.frequency);
        var roundedEnd = utils.dateRoundUp(end, kpi.frequency);

        //console.log("Start: " + roundedStart);
        //console.log("End: " + roundedEnd);

        if (kpi.frequency == null) {
            kpi.getPeriod(start, end, callback);
            return;
        }

        var dates = utils.getDateRange(roundedStart, roundedEnd, kpi.frequency);

        var getValuesCallback = (function(kpiValues) {
            //console.log(dates);
            //console.log(kpiValues);

            var aggregatedValues = [];

            // aggregate by multipleConsolidation type
            if (kpi.multipleConsolidationType) {
                aggregatedValues = this.consolidateMultiple(kpiValues, kpi.frequency, kpi.multipleConsolidationType);
            } else {
                aggregatedValues = kpiValues; //this.consolidateMultiple(kpiValues, kpi.frequency, kpi.consolidationType);
            }

            //console.log(aggregatedValues);

            // merge values from empty date array
            var consolidatedValues = this.mergeDateValues(dates, aggregatedValues);

            //console.log(consolidatedValues);

            if (callback) callback(consolidatedValues);
        }).bind(this)

        kpi.getPeriod(start, end, getValuesCallback);
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
            return a.date.getTime() - b.date.getTime();
        }

        var values = empty.slice().sort(sort);
        var dataValues = data.slice().sort(sort);
        var currentPosition = 0;

        for (var index in dataValues) {
            var value = dataValues[index];
            var inserted = false;

            // list is ordered, so we must continue from last insertion
            for (; currentPosition < values.length; currentPosition++) {
                var element = values[currentPosition];
                if (element.date.getTime() === value.date.getTime()) {
                    values.splice(currentPosition, 1, {
                        date: value.date,
                        value: value.value,
                        weight: value.weight
                    });
                    currentPosition++;
                    inserted = true;
                    break;
                } else if (element.date.getTime() > value.date.getTime()) {
                    values.splice(currentPosition, 0, {
                        date: value.date,
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
