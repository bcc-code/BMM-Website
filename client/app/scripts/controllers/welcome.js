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
      size: 6,
      'content-type': ['speech']
    }, init.mediaLanguage).done(function(data) {

      var left = [], right = [], track;

      $.each(data, function(index) {

        track = bmmFormatterTrack.resolve(this);

        if (index<3) {
          left.push(track);
        } else {
          right.push(track);
        }

      });

      $scope.$apply(function() {
        $scope.latestSpeaksLeft = left;
        $scope.latestSpeaksRight = right;
        draggable.makeDraggable($scope);
      });

    });

    //LATEST VIDEO
    bmmApi.trackLatest({
      size: 5,
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
      size: 8,
      'content-type': ['song']
    }, init.mediaLanguage).done(function(data) {

      var left = [], right = [], track;

      $.each(data, function(index) {

        track = bmmFormatterTrack.resolve(this);

        if (index<4) {
          left.push(track);
        } else {
          right.push(track);
        }

      });

      $scope.$apply(function() {
        $scope.latestMusicLeft = left;
        $scope.latestMusicRight = right;
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
