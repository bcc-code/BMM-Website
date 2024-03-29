'use strict';

angular.module('bmmApp')
  .controller('TrackCtrl', function (
    $scope,
    $location,
    $routeParams,
    _api,
    _track,
    _play
  ) {

    var language;

    if (typeof $routeParams.language!=='undefined') {
      language = $routeParams.language;
    }

    _api.trackGet(
      $routeParams.id,
      undefined,
      language
    ).done(function(track) {

      var _track_ = _track.resolve(track);
      _play.setPlay([_track_], 0);
      $location.path('/album/'+track.parent_id);

    });

  });
