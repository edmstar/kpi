var models = require('../models/models.js');

class KPIService
{
    constructor(app)
    {
        this.app = app;
    }

    load(id, callback, error)
    {
        models.KPI.findOne({ where: { id: id } }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not found.' : false;
            callback(result, errorMessage);
        });
    }

    create(data, callback, error)
    {
        models.KPI.create({ name: data.name}).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not created.' : false;
            callback(result, errorMessage);
        });
    }
}

exports.KPIService = KPIService;