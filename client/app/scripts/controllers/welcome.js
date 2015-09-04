'use strict';

angular.module('bmmApp')
  .controller('WelcomeCtrl', function (
    $scope,
    $timeout,
    $window,
    _api,
    _track,
    _album,
    _init,
    _draggable
  ) {
    //The number of latest music tracks that should be in one column.
    $scope.latestMusicColHeight = 4;

    //The number of latest speeches that should be in one column.
    $scope.latestSpeechesColHeight = 3;

    $(window).off('scrollBottom');

    //LATEST SPEECHS
    _api.trackLatest({
      size: 9,
      'content-type': ['speech']
    }).done(function(data) {

      $scope.$apply(function() {
        $scope.latestSpeeches = data.map(function(trackData) {
          return _track.resolve(trackData);
        });

        _draggable.makeDraggable($scope);
      });

    });

    //LATEST VIDEO
    _api.trackLatest({
      size: 10,
      'content-type': ['video']
    }).done(function(data) {

      var videos = [], track;

      $.each(data, function() {

        track = _track.resolve(this);
        videos.push(track);

      });

      $scope.$apply(function() {
        $scope.latestVideos = videos;
        _draggable.makeDraggable($scope);
      });

    });

    //LATEST MUSIC
    _api.trackLatest({
      size: 12,
      'content-type': ['song']
    }).done(function(data) {
      $scope.$apply(function() {

        $scope.latestMusic = data.map(function(trackData) {
          return _track.resolve(trackData);
        });

        _draggable.makeDraggable($scope);
      });
    });

    //LATEST ALBUMS
    _api.albumLatest({
      size: 20
    }).done(function(data) {

      var albums=[], album;

      $.each(data, function() {

        album = _album.resolve(this);
        albums.push(album);

      });

      $scope.$apply(function() {
        $scope.latestAlbums = albums;
        $timeout(function() {
          $(window).trigger('resize');
        });
      });

    });

    _draggable.makeDraggable($scope);

  });
