'use strict';

describe('Directive: bmmVideoFullscreen', function () {

  // load the directive's module
  beforeEach(module('bmmLibApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bmm-video-fullscreen></bmm-video-fullscreen>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the bmmResize directive');
  }));
});
