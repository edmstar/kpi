var Sequelize = require('sequelize');
var utils = require('../../libs/utils.js');
var constants = require('./constants.js');
var path = require('path');

const appRoot = path.resolve(__dirname);

const sequelize = new Sequelize('kpi', 'admin', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: appRoot + '/database.sqlite',

    define: {
        freezeTableName: true
    },

    logging: false
});

var models = require('../../models/models.js');

/**
 *
 * @param {void} callback
 */
function populateKPI(callback) {
    var KPI = require('../../models/kpi.js')(sequelize);
    items = [];

    var frequencyTypes = [utils.FREQUENCY_TYPES.DAY];
    var consolidationTypes = [utils.CONSOLIDATION_TYPES.SUM, utils.CONSOLIDATION_TYPES.MEAN];

    for (var f in frequencyTypes) {
        var frequency = frequencyTypes[f];
        for (var c in consolidationTypes) {
            var consolidation = consolidationTypes[c];
            items.push({
                name: "KPI|" + consolidation + "|" + frequency,
                format: null,
                consolidationType: consolidation,
                formula: null,
                frequency: frequency,
                multipleConsolidationType: utils.CONSOLIDATION_TYPES.SUM,
                target_type: utils.TARGET_TYPES.NONE,
                target: null,
                target_min_type: utils.TARGET_MARGIN_TYPES.NONE,
                target_min: null,
                target_max_type: utils.TARGET_MARGIN_TYPES.NONE,
                target_max: null,
                target_kpi: null,
                target_min_kpi: null,
                target_max_kpi: null
            });
        }
    }

    KPI.bulkCreate(items).then(() => {
        KPI.findAll().then((values) => {
            populateKPIValues(values, callback);
        });
    });
}

/**
 *
 * @param {KPI} options
 * @param {void} callback
 */
function populateKPIValues(values, callback) {
    var KPI_VALUE = require('../../models/kpi_value.js')(sequelize);
    var kpiValues = [];

    for (var v in values) {
        var kpi = values[v];
        var start = constants.startDate;
        var end = utils.getNextDate(start, kpi.dataValues.frequency, constants.days - 1);
        var dateRange = utils.getDateRange(start, end, kpi.dataValues.frequency);
        for (var d in dateRange) {
            var dateItem = dateRange[d];
            for (var i = 0; i < constants.size; i++) {
                kpiValues.push({
                    id_kpi: kpi.id,
                    date: dateItem.date,
                    value: 1.0,
                    weight: 1.0
                });
            }
        }

    }


    KPI_VALUE.bulkCreate(kpiValues).then(callback);
}

exports.populate = function(callback) {
    populateKPI(callback);
};

exports.sequelize = sequelize;
exports.resetModels = function(callback) {
    models.loadModels(sequelize, {
        force: true
    }, function() {
        exports.KPI = models.KPI;
        exports.KPI_VALUE = models.KPI_VALUE;

        callback();
    });
};
