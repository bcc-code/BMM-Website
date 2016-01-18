'use strict';

/**
 * @ngdoc directive
 * @name bmmApp.directive:bmmLatestTrack
 * @description
 * # bmmLatestTrack
 */
angular.module('bmmApp')
  .directive('bmmLatestTrack', function () {
    return {
      templateUrl: 'views/templates/bmmLatestTrack.html',
      restrict: 'E',
      scope: {
        'track': '=',
        'type': '@',
        'trackNumber': '=',
        'onPlay': '&'
      }
    };
  });
