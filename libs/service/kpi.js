class KPIService {
    constructor(sequelize) {
        this.modelKpi = require('../../models/kpi.js')(sequelize);
        this.modelValue = require('../../models/kpi_value.js')(sequelize);
    }

    load(id, callback, error) {
        this.modelKpi.findOne({
            where: {
                id: id
            }
        }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not found.' : false;
            callback(result, errorMessage);
        });
    }

    loadByName(name, callback, error) {
        this.modelKpi.findOne({
            where: {
                name: name
            }
        }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not found.' : false;
            callback(result, errorMessage);
        });
    }

    create(data, callback, error) {
        this.modelKpi.create(data).then(result => {
            var errorMessage = (result === null) ? 'KPI not created.' : false;
            callback(result, errorMessage);
        }).catch(error);
    }

    loadValue(id, callback, error) {
        this.modelValue.findOne({
            where: {
                id: id
            }
        }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI value not found.' : false;
            callback(result, errorMessage);
        });
    }

    addValue(data, callback, error) {
        this.modelValue.create(data).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not created.' : false;
            callback(result, errorMessage);
        });
    }
}

module.exports = KPIService;
