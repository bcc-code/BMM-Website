'use strict';

angular.module('bmmApp')
  .controller('FtpLinkerCtrl', function ($scope, bmmApi, bmmFormatterTrack) {

    $scope.$parent.contributors = false;

    bmmApi.fileUploadedGuessTracksGet().done(function(groups) {

      //Convert all tracks to formatted tracks
      var guessed = [];
      $.each(groups.guessed, function(key) {
        var tracks = [];
        $.each(this, function() {
          tracks.push(bmmFormatterTrack.resolve(this));
        });

        if (tracks.length<=0) {
          tracks.push({
            albumTitle: 'Album funnet men ikke spor, vennligst legg til spor før kobling'
          });
        }

        guessed.push({
          link: key,
          tracks: tracks
        });
      });

      groups.guessed = guessed;

      $scope.$apply(function() {
        $scope.groups = groups;
      });

    });

    $scope.link = function(link, track, index) {

      bmmApi.fileUploadedNameLink(link, track).done(function() {

        $scope.groups.guessed.splice(index,1);

      });

    };

  });