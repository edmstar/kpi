var model = require('../../models/kpi.js');

class KPIService
{
    constructor(app)
    {
        this.app = app;
    }

    load(id, callback, error)
    {
        model.findOne({ where: { id: id } }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not found.' : false;
            result.printName();
            callback(result, errorMessage);
        });
    }

    create(data, callback, error)
    {
        model.create({ name: data.name }).catch(error).then(result => {
            var errorMessage = (result === null) ? 'KPI not created.' : false;
            callback(result, errorMessage);
        });
    }


}

exports.KPIService = KPIService;