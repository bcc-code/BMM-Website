'use strict';

describe('Controller: CurrentCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var CurrentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CurrentCtrl = $controller('CurrentCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
