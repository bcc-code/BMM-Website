'use strict';

describe('Filter: bmmLanguage', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var bmmLanguage;
  beforeEach(inject(function ($filter) {
    bmmLanguage = $filter('bmmLanguage');
  }));

  it('should return the input prefixed with "bmmLanguage filter:"', function () {
    //var text = 'angularjs';
    //expect(bmmLanguage(text)).toBe('bmmLanguage filter: ' + text);
  });

});
