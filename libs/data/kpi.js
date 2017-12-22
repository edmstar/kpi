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
    return utils.success(objectMapper(value, model));
}

KPIData.prototype.load = function(data) {
    return this.service.load(data.id).then((kpi) => mapToOutput(kpi.dataValues, kpiMap.mapFromModel));
};

KPIData.prototype.loadByName = function(data) {
    return this.service.loadByName(data.name).then((kpi) => mapToOutput(kpi.dataValues, kpiMap.mapFromModel));
};

KPIData.prototype.create = function(data) {
    let dto = objectMapper(data, kpiMap.mapToModel);
    return this.service.create(dto).then((kpi) => mapToOutput(kpi.dataValues, kpiMap.mapFromModel));
};

KPIData.prototype.loadValue = function(data) {
    return this.service.loadValue(data.name).then((kpiValue) => mapToOutput(kpiValue.dataValues, kpiValueMap.mapFromModel));
};

KPIData.prototype.addValue = function(data) {
    let dto = objectMapper(data, kpiValueMap.mapToModel);
    return this.service.addValue(dto).then((kpiValue) => mapToOutput(kpiValue.dataValues, kpiValueMap.mapFromModel));
};

KPIData.prototype.addValues = function(data) {
    let dto = objectMapper(data, kpiValueMap.mapMultipleToModel);
    return this.service.addValues(dto).then((kpiValue) => mapToOutput(kpiValue.dataValues, kpiValueMap.mapFromModel));
};

KPIData.prototype.addValuesCsv = function(data) {
    let dto = objectMapper(data, kpiValueMap.mapToModel);
    return this.service.addValues(dto).then((kpiValue) => mapToOutput(kpiValue.dataValues, kpiValueMap.mapFromModel));
};

module.exports = KPIData;
