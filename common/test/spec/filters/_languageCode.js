'use strict';

describe('Filter: _languageCode', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var _languageCode;
  beforeEach(inject(function ($filter) {
    _languageCode = $filter('_languageCode');
  }));

  it('should return the input prefixed with "_languageCode filter:"', function () {
    //var text = 'angularjs';
    //expect(_languageCode(text)).toBe('_languageCode filter: ' + text);
  });

});
