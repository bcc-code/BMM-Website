'use strict';

describe('Controller: SpeechesCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var SpeechesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpeechesCtrl = $controller('SpeechesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
