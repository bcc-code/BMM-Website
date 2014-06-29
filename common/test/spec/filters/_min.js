'use strict';

describe('Filter: _min', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var _min;
  beforeEach(inject(function ($filter) {
    _min = $filter('_min');
  }));

  it('should return the input prefixed with "_min filter:"', function () {
    //var text = 'angularjs';
    //expect(_min(text)).toBe('_min filter: ' + text);
  });

});
