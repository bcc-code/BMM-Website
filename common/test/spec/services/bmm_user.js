'use strict';

describe('Service: bmmUser', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var bmmUser;
  beforeEach(inject(function (_bmmUser_) {
    bmmUser = _bmmUser_;
  }));

  it('should do something', function () {
    //expect(!!bmmUser).toBe(true);
  });

});
