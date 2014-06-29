'use strict';

angular.module('bmmApp')
  .controller('WaitingsCtrl', function ($scope, $filter, $route, _api, _play, _init, _waitings) {

    $scope.waitings = {};
    $scope.status = _init.translation.states.loadingFiles;

    _api.fileUploadedGuessTracksGet().done(function(waitings) {

      $scope.$apply(function() {

        $scope.waitings = _waitings.resolve(waitings);
        $scope.status = _init.translation.states.filesLoaded;

      });

    });

    $scope.play = function(track) {
      _play.setPlay([track], 0);
    };

    $scope.linkWaiting = function(link, id, lang, album, track, index) {

      _api.fileUploadedNameLink(link, id, lang).done(function() {

        $scope.$apply(function() {
          track.files.splice(index, 1);
        });

      });
    };

    $scope.linkWaitings = function(tracks) {

      var promises = 0;
      $scope.status = _init.translation.states.attemptToLinkTracks;

      $.each(tracks, function() {

        var track = this;

        $.each(this.files, function() {

          promises++;

          _api.fileUploadedNameLink(this.link, track.track.id, this.language).done(function() {
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
