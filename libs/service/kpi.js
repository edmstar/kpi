function KPIService(sequelize) {
    this.sequelize = sequelize;
    this.modelKpi = require('../../models/kpi.js')(sequelize);
    this.modelValue = require('../../models/kpi_value.js')(sequelize);
};

KPIService.prototype.ERROR_KPI_NOT_FOUND = "KPI not found.";
KPIService.prototype.ERROR_KPI_NOT_CREATED = "KPI not created.";
KPIService.prototype.ERROR_KPI_VALUE_NOT_FOUND = "KPI value not found.";
KPIService.prototype.ERROR_KPI_VALUE_NOT_CREATED = "KPI value not created.";

function processResult(result, error) {
    if (!result) throw new Error(error);
    return result;
}

function processKpi(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_NOT_FOUND);
}

function processKpiCreation(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_NOT_CREATED);
}

function processKpiValue(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_VALUE_NOT_FOUND);
}

function processKpiValueCreation(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_VALUE_NOT_CREATED);
}

KPIService.prototype.load = function(id) {
    return this.modelKpi.findOne({
        where: {
            id: id
        }
    }).then(processKpi);
};

KPIService.prototype.loadByName = function(name) {
    return this.modelKpi.findOne({
        where: {
            name: name
        }
    }).then(processKpi);
};

KPIService.prototype.create = function(data) {
    return this.modelKpi.create(data).catch((error) => {
        throw new Error(KPIService.prototype.ERROR_KPI_NOT_CREATED);
    }).then(processKpiCreation);
};

KPIService.prototype.loadValue = function(id) {
    return this.modelValue.findOne({
        where: {
            id: id
        }
    }).then(processKpiValue);
};

KPIService.prototype.addValue = function(data) {
    return this.modelValue.create(data).catch((error) => {
        throw new Error(KPIService.prototype.ERROR_KPI_VALUE_NOT_CREATED);
    }).then(processKpiValueCreation);
};

KPIService.prototype.addValues = function(data) {
    var bulkData = [];

    for (var key in data) {
        var element = data[key];
        var value = {
            id: element.id,
            date: element.date,
            id_kpi: data.id_kpi,
            value: element.value,
            weight: element.weight
        };
        bulkData.push(value);
    }

    console.log(bulkData);

    return this.sequelize.transaction(function(t) {
        return this.modelValue.bulkCreate(bulkData, {
            transaction: t
        });
    }).then(processKpiValueCreation);
};

module.exports = KPIService;
