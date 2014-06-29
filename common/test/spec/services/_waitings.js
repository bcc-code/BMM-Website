'use strict';

describe('Service: waitings', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var waitings;
  beforeEach(inject(function (_waitings_) {
    waitings = _waitings_;
  }));

  it('should do something', function () {
    expect(!!waitings).toBe(true);
  });

});
