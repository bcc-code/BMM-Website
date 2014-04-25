'use strict';

describe('Controller: ImageUploaderCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var ImageUploaderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ImageUploaderCtrl = $controller('ImageUploaderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    //expect(scope.awesomeThings.length).toBe(3);
  });
});
