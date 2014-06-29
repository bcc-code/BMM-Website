'use strict';

describe('Service: _api', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var _api;
  beforeEach(inject(function (__api_) {
    _api = __api_;
  }));

  it('should do something', function () {
    //expect(!!_api).toBe(true);
  });

});
