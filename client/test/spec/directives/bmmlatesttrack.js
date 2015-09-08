'use strict';

describe('Directive: bmmLatestTrack', function () {

  // load the directive's module
  beforeEach(module('bmmApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bmm-latest-track></bmm-latest-track>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bmmLatestTrack directive');
  }));
});
