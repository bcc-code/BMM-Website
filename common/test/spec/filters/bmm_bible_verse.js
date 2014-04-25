'use strict';

describe('Filter: bmmBibleVerse', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var bmmBibleVerse;
  beforeEach(inject(function ($filter) {
    bmmBibleVerse = $filter('bmmBibleVerse');
  }));

  it('should return the input prefixed with "bmmBibleVerse filter:"', function () {
    //var text = 'angularjs';
    //expect(bmmBibleVerse(text)).toBe('bmmBibleVerse filter: ' + text);
  });

});
