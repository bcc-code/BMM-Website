'use strict';

angular.module('bmmApp')
  .controller('WelcomeCtrl', function (
    $scope,
    $timeout,
    bmmApi,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    init,
    draggable
  ) {

    $(window).off('scrollBottom');

    //LATEST SPEECHS
    bmmApi.trackLatest({
      size: 9,
      'content-type': ['speech']
    }, init.mediaLanguage).done(function(data) {

      var left = [], right = [], largeScreen = [], track;

      $.each(data, function(index) {

        track = bmmFormatterTrack.resolve(this);

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
        draggable.makeDraggable($scope);
      });

    });

    //LATEST VIDEO
    bmmApi.trackLatest({
      size: 10,
      'content-type': ['video']
    }, init.mediaLanguage).done(function(data) {

      var videos = [], track;

      $.each(data, function() {

        track = bmmFormatterTrack.resolve(this);
        videos.push(track);

      });

      $scope.$apply(function() {
        $scope.latestVideos = videos;
        draggable.makeDraggable($scope);
      });

    });

    //LATEST MUSIC
    bmmApi.trackLatest({
      size: 12,
      'content-type': ['song']
    }, init.mediaLanguage).done(function(data) {

      var left = [], right = [], largeOnly = [], track;

      $.each(data, function(index) {

        track = bmmFormatterTrack.resolve(this);

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
        draggable.makeDraggable($scope);
      });

    });

    //LATEST ALBUMS
    bmmApi.albumLatest({
      size: 20
    }, init.mediaLanguage).done(function(data) {

      var albums=[], album;

      $.each(data, function() {

        album = bmmFormatterAlbum.resolve(this);
        albums.push(album);

      });

      $scope.$apply(function() {
        $scope.latestAlbums = albums;
        $timeout(function() {
          $(window).trigger('resize');
        });
      });

    });

    draggable.makeDraggable($scope);

  });
