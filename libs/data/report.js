var utils = require('../utils.js');
var ReportService = require('../service/report.js');
var objectMapper = require('object-mapper');

function ReportData(sequelize) {
    this.sequelize = sequelize;
    this.service = new ReportService(sequelize);
}

function throwError(errors) {
    return utils.error(errors);
}

function mapToOutput(value, model) {
    return utils.success(objectMapper(value, model));
}

ReportData.prototype.getPeriodReport = function(data) {
    let dto = {
        kpi: data.kpi,
        kpiName: data.kpiName,
        start: new Date(data.start),
        end: new Date(data.end),
        frequency: data.frequency
    };

    return this.service.getKpiReport(dto); // output mapping to be implemented
};


module.exports = ReportData;
