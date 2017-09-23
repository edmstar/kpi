/*
    Utils
*/

const YEAR = 'year';
const SEMESTER = 'semester';
const MONTH = 'month';
const WEEK = 'week';
const DAY = 'day';
const HOUR = 'hour';
const MINUTE = 'minute';
const SECONDS = 'seconds';

/**
 * @param {string[]} frequencyTypes
 * @param {string[]} consolidationTypes
 */
var frequencyTypes = [YEAR, SEMESTER, MONTH, WEEK, DAY, HOUR, MINUTE, SECONDS];
var consolidationTypes = ['mean', 'weighted', 'sum', 'min', 'max', 'formula'];

/**
 * Verifies if frequency type exists
 * @param {string} frequency 
 */
function containsFrequencyType(frequency) {
    for(var index in frequencyTypes)
    {
        var element = frequencyTypes[index];
        if(element.toLowerCase() === frequency.toLowerCase())
            return true;
    }
    return false;
}

/**
 * Adds to current based on type 
 * @param {Date} current Current date
 * @param {string} frequency Type based on frequency
 */
function getNextDate(current, frequency) {
    if (!(current instanceof Date) || !containsFrequencyType(frequency))
        return null;

    var newDate = new Date(current);
    switch (frequency) {
        case YEAR:
            newDate.setFullYear(newDate.getFullYear() + 1);
            break;
        case SEMESTER:
            newDate.setMonth(newDate.getMonth() + 6);
            break;
        case MONTH:
            newDate.setMonth(newDate.getMonth() + 1);
            break;
        case WEEK:
            newDate.setDate(newDate.getDate() + 7);
            break;
        case DAY:
            newDate.setDate(newDate.getDate() + 1);
            break;
        case HOUR:
            newDate.setHours(newDate.getHours() + 1);
            break;
        case MINUTE:
            newDate.setMinutes(newDate.getMinutes() + 1);
            break;
        case SECONDS:
            newDate.setSeconds(newDate.getSeconds() + 1);
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
    if (!(start instanceof Date && end instanceof Date))
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
    if (!(current instanceof Date) || !containsFrequencyType(frequency))
        return null;

    var newDate = new Date('01/01/1970');
    switch (frequency) {
        case SECONDS:
            newDate.setSeconds(current.getSeconds());
        case MINUTE:
            newDate.setMinutes(current.getMinutes());
        case HOUR:
            newDate.setHours(current.getHours());
        case DAY:
        case WEEK:
            newDate.setDate(current.getDate());
        case MONTH:
            newDate.setMonth(current.getMonth());
        case SEMESTER:
        case YEAR:
            newDate.setFullYear(current.getFullYear());
    }

    return newDate;
}

function dateRoundUp(current, frequency) {
    if (!(current instanceof Date) || !containsFrequencyType(frequency))
        return null;

    var newDate = dateRoundDown(current, frequency);
    newDate = getNextDate(newDate, frequency);
    
    if (frequency != SECONDS)
        newDate.setSeconds(newDate.getSeconds() - 1);

    return newDate;
}

exports.frequencyTypes = frequencyTypes;
exports.consolidationTypes = consolidationTypes;
exports.containsFrequencyType = containsFrequencyType;
exports.dateRoundDown = dateRoundDown;
exports.dateRoundUp = dateRoundUp;
exports.getDateRange = getDateRange;
exports.getNextDate = getNextDate;