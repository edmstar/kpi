var utils = require('../utils.js');
var ReportService = require('../service/report.js');
var objectMapper = require('object-mapper');

class ReportData {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.service = new ReportService(sequelize);
    }

    getPeriodReport(data, callback, errors) {
        var serviceCallback = function(results) {
            if (results) callback(utils.success(results));
        };

        this.service.getKpiReport({
            kpi: data.kpi,
            kpiName: data.kpiName,
            start: new Date(data.start),
            end: new Date(data.end),
            frequency: data.frequency
        }, serviceCallback);
    }
}

module.exports = ReportData;
