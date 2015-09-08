'use strict';

/**
 * @ngdoc directive
 * @name bmmApp.directive:bmmLatestList
 * @description
 * # bmmLatestList
 */
angular.module('bmmApp')
  .directive('bmmLatestList', function () {
    return {
      templateUrl: 'views/templates/bmmLatestList.html',
      restrict: 'E',
      scope: {
        'tracks': '=',
        'listLength': '=',
        'startIndex': '=',
        'size': '@',
        'trackType': '@'
      }
    };
  });
