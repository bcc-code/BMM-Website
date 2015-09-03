'use strict';

/**
 * @ngdoc function
 * @name bmmApp.controller:BmmLatestListCtrl
 * @description
 * # BmmlatestlistCtrl
 * Controller of the bmmApp
 */
angular.module('bmmApp')
  .controller('BmmLatestListCtrl', function ($scope, _play) {

    $scope.displays = {
      speech: {
        title: 'performers',
        interprets: 'albumTitle'
      },
      song: {
        title: 'title',
        interprets: 'performers'
      }
    };


    $scope.startIndex = $scope.startIndex || 0;
    $scope.play = function(indexArg) {
      var index = $scope.getIndex(indexArg);
      _play.setPlay($scope.tracks, index);
    };

    $scope.getIndex = function(index) {
      return $scope.startIndex + index;
    };
  });
