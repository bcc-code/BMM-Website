'use strict';

angular.module('bmmApp')
  .controller('VideoCtrl', function (
    $scope,
    $timeout,
    bmmApi,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    init,
    draggable
  ) {

    $(window).off('scrollBottom');

    var albumFrom = 3, loading=true;

    $(window).on('scrollBottom', function() {

      if (!loading) {

        $('[ng-view]').append('<div class="bmm-loading">'+init.translation.general.loading+'</div>');

        loading = true;

        //ALBUMS
        bmmApi.albumLatest({
          from: albumFrom,
          size: 20,
          'content-type': ['video']
        }, init.mediaLanguage).done(function(data) {

          $.each(data, function() {

            $scope.latestAlbums.push(bmmFormatterAlbum.resolve(this));

            albumFrom++;

          });

          $scope.$apply(function() {
            draggable.makeDraggable($scope);
          });

          $('.bmm-loading').remove();
          loading = false;

        });

      }

    });

    //VIDEOS
    bmmApi.trackLatest({
      size: 9,
      'content-type': ['video']
    }, init.mediaLanguage).done(function(data) {

      var left = [], right = [], largeOnly = [];

      $.each(data, function(index) {

        if (index<3) {
          left.push(bmmFormatterTrack.resolve(this));
        } else if (index<6) {
          right.push(bmmFormatterTrack.resolve(this));
        } else {
          largeOnly.push(bmmFormatterTrack.resolve(this));
        }

      });

      $scope.$apply(function() {
        $scope.latestVideoLeft = left;
        $scope.latestVideoRight = right;
        $scope.latestLargeOnly = largeOnly;
        draggable.makeDraggable($scope);
      });

    });

    //ALBUMS
    bmmApi.albumLatest({
      size: 20,
      'content-type': ['video']
    }, init.mediaLanguage).done(function(data) {

      var album = [];

      $.each(data, function() {

        album.push(bmmFormatterAlbum.resolve(this));

        albumFrom++;

      });

      $scope.$apply(function() {
        $scope.latestAlbums = album;
        draggable.makeDraggable($scope);
      });

      loading = false;

    });

  });
