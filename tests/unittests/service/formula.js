var chai = require('chai');
chai.use(require('chai-uuid'));
chai.use(require('chai-datetime'));
var expect = chai.expect;
var Formula = require('../../../libs/service/consolidate/formula.js');


describe('Formula', function() {
    before(function() {

    });

    it('Formula 2*(1+2+(3-4*(1+1)))+4 should return correct postfix output and resulting value should be 0', function() {
        var f = new Formula(null);
        f.setFormula("2*(1+2+(3-4*(1+1)))+4");
        var stack = f.shuntingYard();
        var expected = [2, 1, 2, '+', 3, 4, 1, 1, '+', '*', '-', '+', '*', 4, '+'];
        expect(f.parse()).to.equal(0);
    });

    it('Formula -(-5)+1*(-1+5*(1^12))+2+3 should return correct postfix output and resulting value should be 14', function() {
        var f = new Formula(null);
        f.setFormula("-(-5)+1*(-1+5*(1^12))+2+3");
        var stack = f.shuntingYard();
        var expected = [5, '_', '_', 1, 1, '_', 5, 1, 12, '^', '*', '+', '*', '+', 2, '+', 3, '+'];
        expect(stack).to.deep.equal(expected);
        expect(f.parse()).to.equal(14);
    });

    it('Formula 1+2^(+1.5*2+2) should return correct postfix output and resulting value should be 33', function() {
        var f = new Formula(null);
        f.setFormula("1+2^(+1.5*2+2)");
        var stack = f.shuntingYard();
        var expected = [1, 2, 1.5, 2, '*', 2, '+', '^', '+'];
        expect(stack).to.deep.equal(expected);
        expect(f.parse()).to.equal(33);
    });

    it('Formula 10/-1*-2 should return correct postfix output and resulting value should be 20', function() {
        var f = new Formula(null);
        f.setFormula("10/-1*-2");
        var stack = f.shuntingYard();
        var expected = [10, 1, '_', '/', 2, '_', '*'];
        expect(stack).to.deep.equal(expected);
        expect(f.parse()).to.equal(20);
    });

    it('Formula 1+MAX(25,2) should return correct postfix output, parse function MAX and return result 26', function() {
        var f = new Formula(null);
        f.setFormula("1+MAX(25,2)");
        var stack = f.shuntingYard();
        var expected = [1, 25, 2, 'MAX', '+'];
        expect(stack).to.deep.equal(expected);
        expect(f.parse()).to.equal(26);
    });

    it('Formula 1+MAX(-(25-3*5),5*MAX(2,\"element2\")^7)%2 should return correct postfix output', function() {
        var f = new Formula(null);
        f.setFormula("1+MAX(-(25-3*5),5*MAX(2,\"element2\")^7)%2");
        var stack = f.shuntingYard();
        var expected = [1, 25, 3, 5, '*', '-', '_', 5, 2, '"element2"', 'MAX', 7, '^', '*', 'MAX', 2, '%', '+'];
        expect(stack).to.deep.equal(expected);
    });
});
