'use strict';

describe('Directive: navigator', function () {

  // load the directive's module
  beforeEach(module('bmmLibApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  /*it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<navigator></navigator>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the navigator directive');
  }));*/
});
