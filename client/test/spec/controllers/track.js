'use strict';

describe('Controller: TrackCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var TrackCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrackCtrl = $controller('TrackCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
