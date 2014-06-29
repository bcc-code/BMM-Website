'use strict';

describe('Filter: _time', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var _time;
  beforeEach(inject(function ($filter) {
    _time = $filter('_time');
  }));

  it('should return the input prefixed with "_time filter:"', function () {
    //var text = 'angularjs';
    //expect(_time(text)).toBe('_time filter: ' + text);
  });

});
