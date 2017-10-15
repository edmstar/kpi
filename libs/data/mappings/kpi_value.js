var utils = require('../../utils.js');

var mapToModel = {
    id: {
        key: "id"
    },
    date: {
        key: "date"
    },
    value: {
        key: "value"
    },
    weight: {
        key: "weight"
    },
    kpi: {
        key: "id_kpi"
    }
};

var mapFromModel = {
    id: {
        key: "id"
    },
    date: {
        key: "date"
    },
    value: {
        key: "value"
    },
    weight: {
        key: "weight"
    },
    id_kpi: {
        key: "kpi"
    }
};

exports.mapToModel = mapToModel;
exports.mapFromModel = mapFromModel;
