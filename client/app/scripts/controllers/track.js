'use strict';

angular.module('bmmApp')
  .controller('TrackCtrl', function (
    $scope,
    $location,
    $routeParams,
    bmmApi,
    bmmFormatterTrack,
    bmmPlay
  ) {

    var language;

    if (typeof $routeParams.language!=='undefined') {
      language = $routeParams.language;
    } else {
      language = init.mediaLanguage;
    }

    bmmApi.trackGet(
      $routeParams.id,
      language
    ).done(function(track) {

      var _track = bmmFormatterTrack.resolve(track);
      $scope.$apply(function() {
        bmmPlay.setPlay([_track], 0);
        $location.path('/album/'+track.parent_id);
      });

    });

  });
