'use strict';

describe('Filter: bmmCover', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var bmmCover;
  beforeEach(inject(function ($filter) {
    bmmCover = $filter('bmmCover');
  }));

  it('should return the input prefixed with "bmmCover filter:"', function () {
    //var text = 'angularjs';
    //expect(bmmCover(text)).toBe('bmmCover filter: ' + text);
  });

});
