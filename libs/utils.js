/*
    Utils
*/

var Enum = require('./enum.js');

const FREQUENCY_TYPES = {
    NONE: null,
    YEAR: 0,
    SEMESTER: 1,
    MONTH: 2,
    WEEK: 3,
    DAY: 4,
    HOUR: 5,
    MINUTE: 6,
    SECONDS: 7
};

const FREQUENCY_TYPES_TRANSLATION = {
    NONE: '',
    YEAR: 'year',
    SEMESTER: 'semester',
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day',
    HOUR: 'hour',
    MINUTE: 'minute',
    SECONDS: 'seconds'
};

const CONSOLIDATION_TYPES = {
    MEAN: 1,
    WEIGHTED: 2,
    SUM: 3,
    MIN: 4,
    MAX: 5,
    FORMULA: 6
};

const CONSOLIDATION_TYPES_TRANSLATION = {
    NONE: '',
    MEAN: 'mean',
    WEIGHTED: 'weighted',
    SUM: 'sum',
    MIN: 'min',
    MAX: 'max',
    FORMULA: 'formula'
};

const TARGET_TYPES = {
    NONE: null,
    CONSTANT: 0,
    KPI: 1
};

const TARGET_TYPES_TRANSLATION = {
    NONE: '',
    CONSTANT: 'constant',
    KPI: 'kpi',
    PERCENTAGE: 'percentage'
};

const TARGET_MARGIN_TYPES = {
    NONE: TARGET_TYPES.NONE,
    CONSTANT: TARGET_TYPES.CONSTANT,
    KPI: TARGET_TYPES.KPI,
    PERCENTAGE: 2
};

const TARGET_MARGIN_TYPES_TRANSLATION = {
    NONE: '',
    CONSTANT: 'constant',
    KPI: 'kpi',
    PERCENTAGE: 'percentage'
};

const TREND_TYPES = {
    NONE: null,
    UP: 0,
    DOWN: 1
};

const TREND_TYPES_TRANSLATION = {
    NONE: '',
    UP: 'up',
    DOWN: 'down'
};

const consolidationTypeEnum = new Enum(CONSOLIDATION_TYPES, CONSOLIDATION_TYPES_TRANSLATION);
const frequencyTypeEnum = new Enum(FREQUENCY_TYPES, FREQUENCY_TYPES_TRANSLATION);
const targetTypeEnum = new Enum(TARGET_TYPES, TARGET_TYPES_TRANSLATION);
const targetMarginTypeEnum = new Enum(TARGET_MARGIN_TYPES, TARGET_MARGIN_TYPES_TRANSLATION);
const trendTypeEnum = new Enum(TREND_TYPES, TREND_TYPES_TRANSLATION);


const SUCCESS = 0;
const ERROR = 1;

function success(data) {
    return {
        status: SUCCESS,
        error: "",
        data: data
    };
}

function error(e) {
    return {
        status: ERROR,
        error: e,
        data: {}
    };
}

/**
 * Adds to current based on type 
 * @param {Date} current Current date
 * @param {string} frequency Type based on frequency
 * @param {integer} count Units of date to be added
 */
function getNextDate(current, frequency, count = 1) {
    if (!(current instanceof Date) || (!frequency) || !frequencyTypeEnum.containsValue(frequency))
        return null;

    var newDate = new Date(current);
    switch (parseInt(frequency)) {
        case FREQUENCY_TYPES.YEAR:
            newDate.setFullYear(newDate.getFullYear() + 1 * count);
            break;
        case FREQUENCY_TYPES.SEMESTER:
            newDate.setMonth(newDate.getMonth() + 6 * count);
            break;
        case FREQUENCY_TYPES.MONTH:
            newDate.setMonth(newDate.getMonth() + 1 * count);
            break;
        case FREQUENCY_TYPES.WEEK:
            newDate.setDate(newDate.getDate() + 7 * count);
            break;
        case FREQUENCY_TYPES.DAY:
            newDate.setDate(newDate.getDate() + 1 * count);
            break;
        case FREQUENCY_TYPES.HOUR:
            newDate.setHours(newDate.getHours() + 1 * count);
            break;
        case FREQUENCY_TYPES.MINUTE:
            newDate.setMinutes(newDate.getMinutes() + 1 * count);
            break;
        case FREQUENCY_TYPES.SECONDS:
            newDate.setSeconds(newDate.getSeconds() + 1 * count);
            break;
    }

    return newDate;
}

/**
 * @param {Date} start Start date
 * @param {Date} end End date
 * @param {string} frequency Type based on frequency
 */
function getDateRange(start, end, frequency) {
    if (!(start instanceof Date && end instanceof Date) || (!frequency) || !frequencyTypeEnum.containsValue(frequency))
        return null;

    var dateRange = [];
    var currentDate = new Date(start);

    while (currentDate <= end) {
        dateRange.push({
            date: currentDate,
            value: null
        });
        currentDate = getNextDate(currentDate, frequency);
    }

    return dateRange;
}

/**
 * 
 * @param {Date} current Date to round down 
 * @param {string} frequency Frequency type 
 * @returns {Date}
 */
function dateRoundDown(current, frequency) {
    if (!(current instanceof Date) || !frequencyTypeEnum.containsValue(frequency))
        return null;

    var newDate = new Date('01/01/1970');
    switch (parseInt(frequency)) {
        case FREQUENCY_TYPES.SECONDS:
            newDate.setSeconds(current.getSeconds());
        case FREQUENCY_TYPES.MINUTE:
            newDate.setMinutes(current.getMinutes());
        case FREQUENCY_TYPES.HOUR:
            newDate.setHours(current.getHours());
        case FREQUENCY_TYPES.DAY:
        case FREQUENCY_TYPES.WEEK:
            newDate.setDate(current.getDate());
        case FREQUENCY_TYPES.MONTH:
            newDate.setMonth(current.getMonth());
        case FREQUENCY_TYPES.SEMESTER:
        case FREQUENCY_TYPES.YEAR:
            newDate.setFullYear(current.getFullYear());
    }

    return newDate;
}

function dateRoundUp(current, frequency) {
    if (!(current instanceof Date) || !frequencyTypeEnum.containsValue(frequency))
        return null;

    var newDate = dateRoundDown(current, frequency);
    newDate = getNextDate(newDate, frequency);

    if (parseInt(frequency) != FREQUENCY_TYPES.SECONDS)
        newDate.setSeconds(newDate.getSeconds() - 1);

    return newDate;
}

exports.success = success;
exports.error = error;
exports.CONSOLIDATION_TYPES = CONSOLIDATION_TYPES;
exports.FREQUENCY_TYPES = FREQUENCY_TYPES;
exports.TARGET_TYPES = TARGET_TYPES;
exports.TARGET_MARGIN_TYPES = TARGET_MARGIN_TYPES;
exports.TREND_TYPES = TREND_TYPES;
exports.dateRoundDown = dateRoundDown;
exports.dateRoundUp = dateRoundUp;
exports.getDateRange = getDateRange;
exports.getNextDate = getNextDate;
exports.consolidationTypeEnum = consolidationTypeEnum;
exports.frequencyTypeEnum = frequencyTypeEnum;
exports.targetTypeEnum = targetTypeEnum;
exports.targetMarginTypeEnum = targetMarginTypeEnum;
exports.trendTypeEnum = trendTypeEnum;
