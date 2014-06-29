'use strict';

describe('Filter: _cover', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var _cover;
  beforeEach(inject(function ($filter) {
    _cover = $filter('_cover');
  }));

  it('should return the input prefixed with "_cover filter:"', function () {
    //var text = 'angularjs';
    //expect(_cover(text)).toBe('_cover filter: ' + text);
  });

});
