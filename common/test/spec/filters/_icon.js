'use strict';

describe('Filter: _icon', function () {

  // load the filter's module
  beforeEach(module('bmmLibApp'));

  // initialize a new instance of the filter before each test
  var _icon;
  beforeEach(inject(function ($filter) {
    _icon = $filter('_icon');
  }));

  it('should return the input prefixed with "_icon filter:"', function () {
    var text = 'angularjs';
    //expect(_icon(text)).toBe('_icon filter: ' + text);
  });

});
