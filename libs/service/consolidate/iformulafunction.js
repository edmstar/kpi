function IFormulaFunction(parameters) {
    this.parameters = parameters;
}

IFormulaFunction.functionName = "";

// the extended function should treat values as a list,
// in which the first value is the first argument of
// the function.
// e.g -> MAX(1,2,3) will provide values = [1, 2, 3] to
// the parse function
IFormulaFunction.prototype.parse = function(values) {
    if (!values || !(values.length === this.parameters))
        throw new Error("Incorrect number of parameters for function " + this.name);
};

IFormulaFunction.prototype.getParametersCount = function() {
    return this.parameters;
};

IFormulaFunction.compose = function(child) {
    child.prototype = Object.create(IFormulaFunction.prototype);
    child.prototype.constructor = child;
};

module.exports = IFormulaFunction;
