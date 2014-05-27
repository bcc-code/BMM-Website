'use strict';

describe('Controller: RelationsCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var RelationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RelationsCtrl = $controller('RelationsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
