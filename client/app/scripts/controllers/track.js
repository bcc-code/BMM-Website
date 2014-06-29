'use strict';

angular.module('bmmApp')
  .controller('TrackCtrl', function (
    $scope,
    $location,
    $routeParams,
    _api,
    _track,
    _play,
    _init
  ) {

    var language;

    if (typeof $routeParams.language!=='undefined') {
      language = $routeParams.language;
    } else {
      language = _init.contentLanguage;
    }

    _api.trackGet(
      $routeParams.id,
      language
    ).done(function(track) {

      var _track_ = _track.resolve(track);
      $scope.$apply(function() {
        _play.setPlay([_track_], 0);
        $location.path('/album/'+track.parent_id);
      });

    });

  });
