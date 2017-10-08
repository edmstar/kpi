var utils = require('../utils.js');
var KPIService = require('../service/kpi.js');

class KPIData {
    constructor(sequelize) {
        this.sequelize = sequelize;
        this.service = new KPIService(sequelize);
    }

    load(data, callback, error) {
        var serviceCallback = function(kpi) {
            if (kpi) callback(utils.success(kpi.dataValues));
            else error(utils.error("KPI not found!"));
        };

        this.service.load(data.id, serviceCallback, () => { error(utils.error(errors)); });
    }

    create(data, callback, error) {
        var serviceCallback = function(kpi) {
            if (kpi) callback(kpi.dataValues);
            else error(utils.error("KPI not created!"));
        };

        var dto = {
            name: data.name,
            frequency: data.frequency
        };

        this.service.create(dto, serviceCallback, () => { error(utils.error(errors)); });
    }

    addValue(data, callback, error) {
        var serviceCallback = function(kpiValue) {
            if (kpiValue) callback(kpiValue.dataValues);
            else error(utils.error("Value not inserted!"));
        };

        var dto = {
            date: data.date,
            value: data.value,
            weight: data.weight,
            id_kpi: data.id_kpi
        };

        this.service.addValue(dto, serviceCallback, () => { error(utils.error(errors)); });
    }
}

module.exports = KPIData;
