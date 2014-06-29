'use strict';

describe('Service: bmmApi', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var bmmApi;
  beforeEach(inject(function (_bmmApi_) {
    bmmApi = _bmmApi_;
  }));

  it('should do something', function () {
    //expect(!!bmmApi).toBe(true);
  });

});
