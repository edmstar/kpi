var utils = require('../../utils.js');

const FORMULA_FUNCTIONS = {
    SUM: {
        name: 'sum'
    } //require('formula/sum.js');
};

const SUM = "+";
const SUBTRACT = "-";
const MULTIPLY = "*";
const DIVIDE = "/";
const MODULE = "%";
const EXPONENTIAL = "^";
const LEFT_PARENTHESIS = "(";
const RIGHT_PARENTHESIS = ")";
const COMMA = ",";
const UNARY_MINUS = "_";

const LEFT_ASSOCIATIVITY = 0;
const RIGHT_ASSOCIATIVITY = 1;

class Formula {
    constructor(sequelize) {
        this.tokenExp = /(([-+*/%^])|(\d+(?:\.{1}\d+)?)|([(),])|([a-zA-Z])+|\"(?:[^"\\]|\\.)*\"|\'(?:[^'\\]|\\.)*\')/g;
        this.argumentExp = /^\"(?:[^"\\]|\\.)*\"|\'(?:[^'\\]|\\.)*\'$/;
        this.sequelize = sequelize;
        this.functions = FORMULA_FUNCTIONS;
    }

    setFormula(formula) {
        this.formula = formula;
    }

    parse() {
        return this.shuntingYard();
    }

    shuntingYard() {
        var outputStream = [];
        var operatorStack = [];

        // shunting yard algorithm
        var token;
        var stackElement;
        var lastMatch = null;

        var expression = this.formula;

        while ((token = this.tokenExp.exec(expression)) !== null) {
            if (token.index === this.tokenExp.lastIndex) {
                this.tokenExp.lastIndex++;
            }

            token.forEach((match, groupIndex) => {
                if (groupIndex == 0) { // gets full match, which is the token
                    if (!isNaN(match)) { // gets the numbers
                        outputStream.push(parseFloat(match));
                    } else {
                        if (lastMatch === null || this.isOperator(lastMatch) || lastMatch === LEFT_PARENTHESIS) {
                            if (match === SUBTRACT)
                                match = UNARY_MINUS;
                            else if (match === SUM)
                                return;
                        }

                        if (this.getAssociativity(match) === LEFT_ASSOCIATIVITY) { // parse left-associative operator
                            while (operatorStack.length > 0) {
                                stackElement = operatorStack.pop();
                                if (this.isParenthesis(stackElement) || this.isLowerPrecedentElement(stackElement, match)) {
                                    operatorStack.push(stackElement);
                                    break;
                                }
                                outputStream.push(stackElement);
                            }
                            operatorStack.push(match);
                        } else if (this.getAssociativity(match) === RIGHT_ASSOCIATIVITY) { // parse right-associative operator
                            while (operatorStack.length > 0) {
                                stackElement = operatorStack.pop();
                                if (this.isParenthesis(stackElement) || this.isLowerOrEqualPrecedentElement(stackElement, match)) {
                                    operatorStack.push(stackElement);
                                    break;
                                }
                                outputStream.push(stackElement);
                            }
                            operatorStack.push(match);
                        } else if (match === LEFT_PARENTHESIS) { // parse opening parenthesis
                            operatorStack.push(match);
                        } else if (match === RIGHT_PARENTHESIS) { // parse closing parenthesis
                            while (operatorStack.length > 0 && (stackElement = operatorStack.pop()) !== LEFT_PARENTHESIS) {
                                outputStream.push(stackElement);
                            }
                            if (operatorStack.length > 0) {
                                stackElement = operatorStack.pop();
                                if (this.isFunction(stackElement))
                                    outputStream.push(stackElement);
                                else
                                    operatorStack.push(stackElement);
                            }
                        } else if (match === UNARY_MINUS) {
                            operatorStack.push(match);
                        } else if (this.isFunction(match)) {
                            operatorStack.push(match);
                        } else if (match === COMMA) {
                            while (operatorStack.length > 0 && (stackElement = operatorStack.pop()) !== LEFT_PARENTHESIS) {
                                outputStream.push(stackElement);
                            }
                            if (stackElement === LEFT_PARENTHESIS)
                                operatorStack.push(stackElement);
                        } else if (this.argumentExp.test(match)) {
                            outputStream.push(match);
                        } else {
                            throw new Error("Invalid operator: " + match + " on formula " + expression);
                        }
                    }
                    lastMatch = match;
                }
            });
        }

        while (operatorStack.length > 0) {
            stackElement = operatorStack.pop();
            outputStream.push(stackElement);
        }

        return outputStream;
    }

    isLowerPrecedentElement(element, compare) {
        var elementScore = this.getPrescedence(element);
        var compareScore = this.getPrescedence(compare);

        return elementScore < compareScore;
    }

    isLowerOrEqualPrecedentElement(element, compare) {
        var elementScore = this.getPrescedence(element);
        var compareScore = this.getPrescedence(compare);

        return elementScore <= compareScore;
    }

    isParenthesis(element) {
        return element === LEFT_PARENTHESIS || element === RIGHT_PARENTHESIS;
    }

    isOperator(element) {
        return element === SUM || element === SUBTRACT || element === MULTIPLY || element === DIVIDE || element === MODULE || element === EXPONENTIAL;
    }

    getFunction(element) {
        for (var i in this.functions) {
            var f = this.functions[i];
            if (element.toLowerCase() === f.name.toLowerCase())
                return f;
        }
        return null;
    }

    isFunction(element) {
        return this.getFunction(element) !== null;
    }

    getAssociativity(element) {
        switch (element) {
            case SUM:
            case SUBTRACT:
            case MULTIPLY:
            case DIVIDE:
            case MODULE:
                return LEFT_ASSOCIATIVITY;
            case EXPONENTIAL:
                return RIGHT_ASSOCIATIVITY;
        }
        return null;
    }

    getPrescedence(element) {
        switch (element) {
            case SUM:
            case SUBTRACT:
                return 0;
            case MULTIPLY:
            case DIVIDE:
            case MODULE:
                return 1;
            case UNARY_MINUS:
                return 2;
            case EXPONENTIAL:
                return 3;
        }
        return 0;
    };
}

module.exports = Formula;
