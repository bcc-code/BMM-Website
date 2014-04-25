'use strict';

describe('Controller: ContributorUploaderCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var ContributorUploaderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ContributorUploaderCtrl = $controller('ContributorUploaderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
