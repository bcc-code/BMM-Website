'use strict';

angular.module('bmmApp')
  .controller('TrackBibleCtrl', function ($scope, $filter, $timeout) {

    $scope.$watch('bible.raw', function(text) {

      //Timeout because of strange bug @todo - find out why
      $timeout(function() {
        $scope.bible.filtered = $filter('bmmBibleVerse')(text);
      }, 500);

    });

  });