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

    create(data, callback, error) {
        this.modelKpi.create(data).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not created.' : false;
            callback(result, errorMessage);
        });
    }

    populate(data) {
        var currentDate = new Date('2016-09-22 00:00:00');
        for (var i = 0; i < 90; i++) {
            this.addValue({
                id_kpi: data.id_kpi,
                date: new Date(currentDate),
                value: i % 3
            }, function() {}, function() {});
            currentDate.setHours(currentDate.getHours() + 8);
        }
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
