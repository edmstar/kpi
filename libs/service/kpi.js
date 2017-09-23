var modelKpi = require('../../models/kpi.js');
var modelValue = require('../../models/kpi_value.js');

class KPIService {
    constructor(app) {
        this.app = app;
    }

    load(id, callback, error) {
        modelKpi.findOne({ where: { id: id } }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not found.' : false;
            callback(result, errorMessage);
        });
    }

    create(data, callback, error) {
        modelKpi.create({ name: data.name, frequency: data.frequency }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not created.' : false;
            callback(result, errorMessage);
        });
    }

    populate() {
        var currentDate = new Date('2016-09-22 00:00:00');
        for(var i = 0; i<90; i++)
        {
            this.addValue({ date: new Date(currentDate), value: i % 3 }, function() {}, function() {});
            currentDate.setHours(currentDate.getHours() + 8);
        }
    }

    addValue(data, callback, error) {
        modelValue.create({ date: data.date, value: data.value, weight: 1, id_kpi: 3 }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not created.' : false;
            callback(result, errorMessage);
        });
    }
}

exports.KPIService = KPIService;