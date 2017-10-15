var utils = require('../utils.js');
var KPIService = require('../service/kpi.js');
var objectMapper = require('object-mapper');
var kpiMap = require('./mappings/kpi.js');
var kpiValueMap = require('./mappings/kpi_value.js');

class KPIData {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.service = new KPIService(sequelize);
    }

    load(data, callback, error) {
        var serviceCallback = function(kpi) {
            if (kpi) callback(utils.success(objectMapper(kpi.dataValues, kpiMap.mapFromModel)));
        };

        this.service.load(data.id, serviceCallback, (errors) => {
            error(utils.error(errors));
        });
    }

    create(data, callback, error) {
        var serviceCallback = function(kpi) {
            if (kpi) callback(utils.success(objectMapper(kpi.dataValues, kpiMap.mapFromModel)));
        };

        var dto = objectMapper(data, kpiMap.mapToModel);
        this.service.create(dto, serviceCallback, (errors) => {
            error(utils.error(errors));
        });
    }

    loadValue(data, callback, error) {
        var serviceCallback = function(kpiValue) {
            if (kpiValue) callback(utils.success(objectMapper(kpiValue.dataValues, kpiValueMap.mapFromModel)));
        };

        this.service.loadValue(data.id, serviceCallback, (errors) => {
            error(utils.error(errors));
        });
    }

    addValue(data, callback, error) {
        var serviceCallback = function(kpiValue) {
            if (kpiValue) callback(utils.success(kpiValue.dataVaues, kpiValueMap.mapFromModel));
        };

        var dto = objectMapper(data, kpiValueMap.mapToModel);
        this.service.addValue(dto, serviceCallback, (errors) => {
            error(utils.error(errors));
        });
    }
}

module.exports = KPIData;
