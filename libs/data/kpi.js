var utils = require('../utils.js');
var KPIService = require('../service/kpi.js');
var objectMapper = require('object-mapper');
var kpiMap = require('./mappings/kpi.js');
var kpiValueMap = require('./mappings/kpi_value.js');

function KPIData(sequelize) {
    this.sequelize = sequelize;
    this.service = new KPIService(sequelize);
}

function mapToOutput(value, model) {
    return objectMapper(value, model);
}

function mapFromKpi(kpi) {
    return mapToOutput(kpi.dataValues, kpiMap.mapFromModel);
}

function mapFromKpiValue(kpiValue) {
    return mapToOutput(kpiValue.dataValues, kpiValueMap.mapFromModel);
}

KPIData.prototype.load = function(data) {
    return this.service.load(data.id).then(mapFromKpi);
};

KPIData.prototype.loadByName = function(data) {
    return this.service.loadByName(data.name).then(mapFromKpi);
};

KPIData.prototype.create = function(data) {
    let dto = objectMapper(data, kpiMap.mapToModel);
    return this.service.create(dto).then(mapFromKpi);
};

KPIData.prototype.delete = function(data) {
    return this.service.delete(data.id).then(mapFromKpi);
};

KPIData.prototype.loadValue = function(data) {
    return this.service.loadValue(data.name).then(mapFromKpiValue);
};

KPIData.prototype.addValue = function(data) {
    let dto = objectMapper(data, kpiValueMap.mapToModel);
    return this.service.addValue(dto).then(mapFromKpiValue);
};

KPIData.prototype.addValues = function(data) {
    let dto = objectMapper(data, kpiValueMap.mapMultipleToModel);
    return this.service.addValues(dto).then(mapFromKpiValue);
};

KPIData.prototype.addValuesCsv = function(data) {
    let dto = objectMapper(data, kpiValueMap.mapToModel);
    return this.service.addValues(dto).then(mapFromKpiValue);
};

KPIData.prototype.deleteValue = function(data) {
    return this.service.deleteValue(data.id).then(mapFromKpiValue);
};

module.exports = KPIData;
