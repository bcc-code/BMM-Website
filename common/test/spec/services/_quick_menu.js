'use strict';

describe('Service: quickMenu', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var quickMenu;
  beforeEach(inject(function (_quickMenu_) {
    quickMenu = _quickMenu_;
  }));

  it('should do something', function () {
    expect(!!quickMenu).toBe(true);
  });

});
