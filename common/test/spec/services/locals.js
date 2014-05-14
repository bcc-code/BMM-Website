'use strict';

describe('Service: locals', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var locals;
  beforeEach(inject(function (_locals_) {
    locals = _locals_;
  }));

  it('should do something', function () {
    expect(!!locals).toBe(true);
  });

});
