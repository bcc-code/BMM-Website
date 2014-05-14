'use strict';

describe('Service: draggable', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var draggable;
  beforeEach(inject(function (_draggable_) {
    draggable = _draggable_;
  }));

  it('should do something', function () {
    expect(!!draggable).toBe(true);
  });

});
