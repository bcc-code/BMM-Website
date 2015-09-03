'use strict';

describe('Controller: BmmlatestlistCtrl', function () {

  // load the controller's module
  beforeEach(module('bmmApp'));

  var BmmlatestlistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BmmlatestlistCtrl = $controller('BmmlatestlistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BmmlatestlistCtrl.awesomeThings.length).toBe(3);
  });
});
