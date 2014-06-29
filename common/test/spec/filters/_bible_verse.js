'use strict';

describe('Filter: _bibleVerse', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var _bibleVerse;
  beforeEach(inject(function ($filter) {
    _bibleVerse = $filter('_bibleVerse');
  }));

  it('should return the input prefixed with "_bibleVerse filter:"', function () {
    //var text = 'angularjs';
    //expect(_bibleVerse(text)).toBe('_bibleVerse filter: ' + text);
  });

});
