'use strict';

describe('Filter: bmmTime', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var bmmTime;
  beforeEach(inject(function ($filter) {
    bmmTime = $filter('bmmTime');
  }));

  it('should return the input prefixed with "bmmTime filter:"', function () {
    //var text = 'angularjs';
    //expect(bmmTime(text)).toBe('bmmTime filter: ' + text);
  });

});
