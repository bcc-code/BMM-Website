'use strict';

angular.module('bmmApp')
  .controller('TrackBibleCtrl', function ($scope, $filter) {

    $scope.filtered = {};

    $scope.$watch('bible.raw', function(raw) {
      $scope.filtered = $filter('bmmBibleVerse')(raw);
    });

  });