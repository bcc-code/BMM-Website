'use strict';

describe('Filter: _locals', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var _locals;
  beforeEach(inject(function ($filter) {
    _locals = $filter('_locals');
  }));

  it('should return the input prefixed with "_locals filter:"', function () {
    var text = 'angularjs';
    expect(_locals(text)).toBe('_locals filter: ' + text);
  });

});
