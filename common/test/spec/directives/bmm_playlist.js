'use strict';

describe('Directive: bmmPlaylist', function () {

  // load the directive's module
  beforeEach(module('bmmLibApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<bmm-playlist></bmm-playlist>');
    element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the bmmPlaylist directive');
  }));
});
