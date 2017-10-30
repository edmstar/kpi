class IFormulaFunction {
    static get name() { return ""; }

    constructor(parameters) {
        this.parameters = parameters;
    }

    // the extended function should treat values as a list,
    // in which the first value is the first argument of
    // the function.
    // e.g -> MAX(1,2,3) will provide values = [1, 2, 3] to
    // the parse function
    parse(values) {
        if (!values || !(values.length === this.parameters))
            throw new Error("Incorrect number of parameters for function " + this.name);
    }

    getParametersCount() {
        return this.parameters;
    }
}

module.exports = IFormulaFunction;
