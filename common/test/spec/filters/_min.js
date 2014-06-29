'use strict';

describe('Filter: bmmMin', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var min;
  beforeEach(inject(function ($filter) {
    min = $filter('bmmMin');
  }));

  it('should return the input prefixed with "min filter:"', function () {
    //var text = 'angularjs';
    //expect(min(text)).toBe('min filter: ' + text);
  });

});
