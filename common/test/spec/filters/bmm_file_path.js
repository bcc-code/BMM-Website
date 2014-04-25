'use strict';

describe('Filter: bmmFilePath', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var bmmFilePath;
  beforeEach(inject(function ($filter) {
    bmmFilePath = $filter('bmmFilePath');
  }));

  it('should return the input prefixed with "bmmFilePath filter:"', function () {
    //var text = 'angularjs';
    //expect(bmmFilePath(text)).toBe('bmmFilePath filter: ' + text);
  });

});
