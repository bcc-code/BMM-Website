'use strict';

describe('Service: bmmPlayer', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var bmmPlayer;
  beforeEach(inject(function (_bmmPlayer_) {
    bmmPlayer = _bmmPlayer_;
  }));

  it('should do something', function () {
    //expect(!!bmmPlayer).toBe(true);
  });

});
