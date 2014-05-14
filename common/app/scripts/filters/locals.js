'use strict';

angular.module('bmmLibApp')
  .filter('locals', function () {
    return function (input) {

      return 'title filter: ' + input;
    };
  });
