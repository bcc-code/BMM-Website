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

    $(window).off('scrollBottom');

    // @analytics - Report page view to google analytics
    $scope.$on('$viewContentLoaded', function() {
      $window.ga('send', 'pageview', {
        'page': '/welcome',
        'title': 'Welcome'
      });
    });

    //LATEST SPEECHS
    _api.trackLatest({
      size: 9,
      'content-type': ['speech']
    }, _init.contentLanguage).done(function(data) {

      var left = [], right = [], largeScreen = [], track;

      $.each(data, function(index) {

        track = _track.resolve(this);

        if (index<3) {
          left.push(track);
        } else if (index<6) {
          right.push(track);
        } else {
          largeScreen.push(track);
        }

      });

      $scope.$apply(function() {
        $scope.latestSpeaksLeft = left;
        $scope.latestSpeaksRight = right;
        $scope.latestSpeaksLargeScreen = largeScreen;
        _draggable.makeDraggable($scope);
      });

    });

    //LATEST VIDEO
    _api.trackLatest({
      size: 10,
      'content-type': ['video']
    }, _init.contentLanguage).done(function(data) {

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
    }, _init.contentLanguage).done(function(data) {

      var left = [], right = [], largeOnly = [], track;

      $.each(data, function(index) {

        track = _track.resolve(this);

        if (index<4) {
          left.push(track);
        } else if (index<8) {
          right.push(track);
        } else {
          largeOnly.push(track);
        }

      });

      $scope.$apply(function() {
        $scope.latestMusicLeft = left;
        $scope.latestMusicRight = right;
        $scope.latestMusicLargeOnly = largeOnly;
        _draggable.makeDraggable($scope);
      });

    });

    //LATEST ALBUMS
    _api.albumLatest({
      size: 20
    }, _init.contentLanguage).done(function(data) {

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
