'use strict';

describe('Controller: TrackBibleCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var TrackBibleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TrackBibleCtrl = $controller('TrackBibleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
