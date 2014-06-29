'use strict';

describe('Service: init', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var init;
  beforeEach(inject(function (_init_) {
    init = _init_;
  }));

  it('should do something', function () {
    expect(!!init).toBe(true);
  });

});
