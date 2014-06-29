'use strict';

describe('Filter: _protectedURL', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var _protectedURL;
  beforeEach(inject(function ($filter) {
    _protectedURL = $filter('_protectedURL');
  }));

  it('should return the input prefixed with "_protectedURL filter:"', function () {
    //var text = 'angularjs';
    //expect(_protectedURL(text)).toBe('_protectedURL filter: ' + text);
  });

});
