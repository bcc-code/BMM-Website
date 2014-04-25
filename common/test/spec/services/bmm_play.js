'use strict';

describe('Service: bmmPlay', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var bmmPlay;
  beforeEach(inject(function (_bmmPlay_) {
    bmmPlay = _bmmPlay_;
  }));

  it('should do something', function () {
    //expect(!!bmmPlay).toBe(true);
  });

});
