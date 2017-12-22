const IFormula = require('../iformulafunction.js');

function FunctionMax() {
    IFormula.call(this, 2);
}

IFormula.compose(FunctionMax);

FunctionMax.functionName = "max";

// Override functions

FunctionMax.prototype.parse = function(values) {
    IFormula.prototype.parse.call(this, values);

    var max = null;

    for (var v in values) {
        var value = values[v];
        if (max === null || max <= value)
            max = value;
    }

    return max;
};

module.exports = FunctionMax;
