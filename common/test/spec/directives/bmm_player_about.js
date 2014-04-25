'use strict';

describe('Directive: bmmPlayerAbout', function () {

  // load the directive's module
  beforeEach(module('bmmLibApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bmm-player-about></bmm-player-about>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the bmmPlayerAbout directive');
  }));
});
