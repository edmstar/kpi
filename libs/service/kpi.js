function KPIService(sequelize) {
    this.sequelize = sequelize;
    this.modelKpi = require('../../models/kpi.js')(sequelize);
    this.modelValue = require('../../models/kpi_value.js')(sequelize);
};

KPIService.prototype.ERROR_KPI_NOT_FOUND = "KPI not found.";
KPIService.prototype.ERROR_KPI_NOT_CREATED = "KPI not created.";
KPIService.prototype.ERROR_KPI_NOT_UPDATED = "KPI not updated.";
KPIService.prototype.ERROR_KPI_NOT_DELETED = "KPI not deleted.";
KPIService.prototype.ERROR_KPI_VALUE_NOT_FOUND = "KPI value not found.";
KPIService.prototype.ERROR_KPI_VALUE_NOT_CREATED = "KPI value not created.";
KPIService.prototype.ERROR_KPI_VALUE_NOT_UPDATED = "KPI value not updated.";
KPIService.prototype.ERROR_KPI_VALUE_NOT_DELETED = "KPI value not deleted.";

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

function processKpiUpdate(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_NOT_UPDATED);
}

function processKpiDeletion(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_NOT_DELETED);
}

function processKpiValue(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_VALUE_NOT_FOUND);
}

function processKpiValueCreation(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_VALUE_NOT_CREATED);
}

function processKpiValueUpdate(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_VALUE_NOT_UPDATED);
}

function processKpiValueDeletion(result) {
    return processResult(result, KPIService.prototype.ERROR_KPI_VALUE_NOT_DELETED);
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

KPIService.prototype.update = function(data) {
    return this.modelKpi.update(data).catch((error) => {
        throw new Error(KPIService.prototype.ERROR_KPI_NOT_UPDATED);
    }).then(processKpiUpdate);
};

KPIService.prototype.delete = function(id) {
    return this.load(id).then(result => result.destroy()).catch((error) => {
        throw new Error(KPIService.prototype.ERROR_KPI_NOT_DELETED);
    });
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

    return this.sequelize.transaction(function(t) {
        return this.modelValue.bulkCreate(bulkData, {
            transaction: t
        });
    }).then(processKpiValueCreation);
};

KPIService.prototype.update = function(data) {
    return this.modelValue.update(data).catch((error) => {
        throw new Error(KPIService.prototype.ERROR_KPI_VALUE_NOT_UPDATED);
    }).then(processKpiValueUpdate);
};

KPIService.prototype.deleteValue = function(id) {
    return this.loadValue(id).then(result => result.destroy()).catch((error) => {
        throw new Error(KPIService.prototype.ERROR_KPI_VALUE_NOT_DELETED);
    });
};

module.exports = KPIService;
