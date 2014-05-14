'use strict';

describe('Controller: WaitingsCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var WaitingsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WaitingsCtrl = $controller('WaitingsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
