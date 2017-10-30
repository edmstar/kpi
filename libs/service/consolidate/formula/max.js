var IFormula = require('../iformulafunction.js');

class FunctionMax extends IFormula {
    static get name() { return "max"; }

    constructor() {
        super(2);
    }

    parse(values) {
        super.parse(values);

        var max = null;

        for(var v in values) {
            var value = values[v];
            if (max === null || max <= value)
                max = value;
        }

        return max;
    }
}

module.exports = FunctionMax;
