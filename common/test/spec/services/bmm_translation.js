'use strict';

describe('Service: bmmTranslation', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var bmmTranslation;
  beforeEach(inject(function (_bmmTranslation_) {
    bmmTranslation = _bmmTranslation_;
  }));

  it('should do something', function () {
    expect(!!bmmTranslation).toBe(true);
  });

});
