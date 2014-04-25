'use strict';

describe('Controller: AudiobooksCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var AudiobooksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AudiobooksCtrl = $controller('AudiobooksCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
