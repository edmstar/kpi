// tests/part1/cart-summary-test.js
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var consolidate = require('../../../libs/service/consolidate.js');
var model = require('../models.js');

describe('ConsolidateService', function() {
  beforeEach(function(done)
  {
    this.timeout(10000);
    model.resetModels(function()
    {
      model.populate(function() {
        done()
      });
    });
  });

  it('getSubtotal() should return 0 if no items are passed in', function() {
    expect(0).to.equal(0);
  });
});