var chai = require('chai').use(require('chai-datetime'));
var expect = chai.expect; // we are using the "expect" style of Chai
var utils = require('../../../libs/utils.js');

describe('Utils', function() {

    it('getNextDate(date, frequency) should return the next date according to the frequency type provided', function() {
        var startDate = new Date('2000-01-01T00:00:00Z');

        var dates = [{
                expected: new Date('2000-01-01T00:00:01Z'),
                frequency: utils.FREQUENCY_TYPES.SECONDS
            },
            {
                expected: new Date('2000-01-01T00:01:00Z'),
                frequency: utils.FREQUENCY_TYPES.MINUTE
            },
            {
                expected: new Date('2000-01-01T01:00:00Z'),
                frequency: utils.FREQUENCY_TYPES.HOUR
            },
            {
                expected: new Date('2000-01-02T00:00:00Z'),
                frequency: utils.FREQUENCY_TYPES.DAY
            },
            {
                expected: new Date('2000-01-08T00:00:00Z'),
                frequency: utils.FREQUENCY_TYPES.WEEK
            },
            {
                expected: new Date('2000-02-01T00:00:00Z'),
                frequency: utils.FREQUENCY_TYPES.MONTH
            },
            {
                expected: new Date('2000-07-01T00:00:00Z'),
                frequency: utils.FREQUENCY_TYPES.SEMESTER
            },
            {
                expected: new Date('2001-01-01T00:00:00Z'),
                frequency: utils.FREQUENCY_TYPES.YEAR
            }
        ];

        for (var d in dates) {
            var date = dates[d];
            expect(utils.getNextDate(startDate, date.frequency)).to.equalDate(date.expected);
        }

    });

});
