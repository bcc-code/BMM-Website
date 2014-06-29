'use strict';

describe('Filter: locals', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var locals;
  beforeEach(inject(function ($filter) {
    locals = $filter('locals');
  }));

  it('should return the input prefixed with "locals filter:"', function () {
    var text = 'angularjs';
    expect(locals(text)).toBe('locals filter: ' + text);
  });

});
