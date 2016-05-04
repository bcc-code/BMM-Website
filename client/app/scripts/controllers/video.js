'use strict';

angular.module('bmmApp')
  .controller('VideoCtrl', function (
    $scope,
    $window,
    $rootScope,
    _api,
    _track,
    _album,
    _init,
    _draggable
  ) {

    $scope.latestVideo = [];

    $scope.latestVideoColHeight = 3;

    $(window).off('scrollBottom');

    $scope.load = true;

    var albumFrom = 3, loading=true;

    $(window).on('scrollBottom', function() {

      if (!loading) {

        //$('[ng-view]').append('<div class="bmm-loading">'+_init.translation.general.loading+'</div>');

        loading = true;
        $rootScope.safeApply(function() {
          $scope.load = true;
        });

        //ALBUMS
        _api.albumLatest({
          from: albumFrom,
          size: 20,
          'content-type': ['video']
        }).done(function(data) {

          $.each(data, function() {

            $scope.latestAlbums.push(_album.resolve(this));

            albumFrom++;

          });

          _draggable.makeDraggable($scope);
          $scope.load = false;

          //$('.bmm-loading').remove();
          loading = false;

        });

      }

    });

    //VIDEOS
    _api.trackLatest({
      size: 9,
      'content-type': ['video']
    }).done(function(data) {
      $scope.latestVideo = data.map(function(track) {
        return _track.resolve(track);
      });

      _draggable.makeDraggable($scope);
    });

    //ALBUMS
    _api.albumLatest({
      size: 20,
      'content-type': ['video']
    }).done(function(data) {

      var album = [];

      $.each(data, function() {

        album.push(_album.resolve(this));

        albumFrom++;

      });

      $scope.latestAlbums = album;
      _draggable.makeDraggable($scope);

      loading = false;
      $scope.load = false;

    });

  });
