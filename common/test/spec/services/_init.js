'use strict';

describe('Service: _init', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var _init;
  beforeEach(inject(function (__init_) {
    _init = __init_;
  }));

  it('should do something', function () {
    //expect(!!_init).toBe(true);
  });

});
