'use strict';

describe('Controller: MusicCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var MusicCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MusicCtrl = $controller('MusicCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
