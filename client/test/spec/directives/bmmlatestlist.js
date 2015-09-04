'use strict';

describe('Directive: bmmLatestList', function () {

  // load the directive's module
  beforeEach(module('bmmApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bmm-latest-list></bmm-latest-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the bmmLatestList directive');
  }));
});
