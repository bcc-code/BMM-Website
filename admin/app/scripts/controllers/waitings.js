'use strict';

angular.module('bmmApp')
  .controller('WaitingsCtrl', function ($scope, $filter, $route, bmmApi, bmmPlay, init, waitings) {

    $scope.waitings = {};
    $scope.status = init.translation.states.loadingFiles;

    bmmApi.fileUploadedGuessTracksGet().done(function(_waitings) {

      $scope.$apply(function() {

        $scope.waitings = waitings.resolve(_waitings);
        $scope.status = init.translation.states.filesLoaded;

      });

    });

    $scope.play = function(track) {
      bmmPlay.setPlay([track], 0);
    };

    $scope.linkWaiting = function(link, id, lang, album, track, index) {

      bmmApi.fileUploadedNameLink(link, id, lang).done(function() {

        track.files.splice(index, 1);

      });
    };

    $scope.linkWaitings = function(tracks) {

      var promises = 0;
      $scope.status = init.translation.states.attemptToLinkTracks;

      $.each(tracks, function() {

        var track = this;

        $.each(this.files, function() {

          promises++;

          bmmApi.fileUploadedNameLink(this.link, track.track.id, this.language).done(function() {
            promises--;
            if (promises===0) {
              $route.reload();
            }
          }).fail(function() {
            $route.reload();
          });

        });

      });

    };

  });
