class IFormulaFunction {
    constructor(name, parameters) {
        this.name = name;
        this.parameters = parameters;
    }

    parse(values) {
        if (!values || !values.length == this.parameters)
            throw new Error("Incorrect number of parameters for function " + this.name);
    }
}
