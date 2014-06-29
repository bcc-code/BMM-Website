'use strict';

angular.module('bmmApp')
  .controller('VideoCtrl', function (
    $scope,
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
        'page': '/video',
        'title': 'Video'
      });
    });

    $scope.load = true;

    var albumFrom = 3, loading=true;

    $(window).on('scrollBottom', function() {

      if (!loading) {

        //$('[ng-view]').append('<div class="bmm-loading">'+_init.translation.general.loading+'</div>');

        loading = true;
        $scope.$apply(function() {
          $scope.load = true;
        });

        //ALBUMS
        _api.albumLatest({
          from: albumFrom,
          size: 20,
          'content-type': ['video']
        }, _init.contentLanguage).done(function(data) {

          $.each(data, function() {

            $scope.latestAlbums.push(_album.resolve(this));

            albumFrom++;

          });

          $scope.$apply(function() {
            _draggable.makeDraggable($scope);
            $scope.load = false;
          });

          //$('.bmm-loading').remove();
          loading = false;

        });

      }

    });

    //VIDEOS
    _api.trackLatest({
      size: 9,
      'content-type': ['video']
    }, _init.contentLanguage).done(function(data) {

      var left = [], right = [], largeOnly = [];

      $.each(data, function(index) {

        if (index<3) {
          left.push(_track.resolve(this));
        } else if (index<6) {
          right.push(_track.resolve(this));
        } else {
          largeOnly.push(_track.resolve(this));
        }

      });

      $scope.$apply(function() {
        $scope.latestVideoLeft = left;
        $scope.latestVideoRight = right;
        $scope.latestLargeOnly = largeOnly;
        _draggable.makeDraggable($scope);
      });

    });

    //ALBUMS
    _api.albumLatest({
      size: 20,
      'content-type': ['video']
    }, _init.contentLanguage).done(function(data) {

      var album = [];

      $.each(data, function() {

        album.push(_album.resolve(this));

        albumFrom++;

      });

      $scope.$apply(function() {
        $scope.latestAlbums = album;
        _draggable.makeDraggable($scope);
      });

      loading = false;
      $scope.load = false;

    });

  });
