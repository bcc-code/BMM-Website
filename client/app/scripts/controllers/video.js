'use strict';

angular.module('bmmApp')
  .controller('VideoCtrl', function (
    $scope,
    $timeout,
    bmmApi,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    bmmUser
  ) {

    $(window).off('scrollBottom');

    var albumFrom = 3, loading=true;

    $(window).on('scrollBottom', function() {

      if (!loading) {

        $('[ng-view]').append('<div class="bmm-loading">Laster...</div>');

        loading = true;

        //ALBUMS
        bmmApi.albumLatest({
          from: albumFrom,
          size: 20,
          'content-type': ['video']
        }, bmmUser.mediaLanguage).done(function(data) {

          $.each(data, function() {

            $scope.latestAlbums.push(bmmFormatterAlbum.resolve(this));

            albumFrom++;

          });

          $scope.$apply(function() {
            makeDraggable();
          });

          $('.bmm-loading').remove();
          loading = false;

        });

      }

    });

    //VIDEOS
    bmmApi.trackLatest({
      size: 3,
      'content-type': ['video']
    }, bmmUser.mediaLanguage).done(function(data) {

      var videos = [];

      $.each(data, function() {

        videos.push(bmmFormatterTrack.resolve(this));

      });

      $scope.$apply(function() {
        $scope.firstVideos = videos;
        makeDraggable();
      });

    });

    //ALBUMS
    bmmApi.albumLatest({
      size: 20,
      'content-type': ['video']
    }, bmmUser.mediaLanguage).done(function(data) {

      var album = [];

      $.each(data, function() {

        album.push(bmmFormatterAlbum.resolve(this));

        albumFrom++;

      });

      $scope.$apply(function() {
        $scope.latestAlbums = album;
        makeDraggable();
      });

      loading = false;

    });

    var makeDraggable = function() {

      $timeout(function() {

        $('.draggable').draggable({
          helper: 'clone',
          appendTo: 'body',
          revert: 'invalid',
          scope: 'move',
          zIndex: '1000',
          distance: 20,
          cursorAt: {
            left: 20
          }
        });

        $('body').find('.bmm-playlist-private').droppable({
          scope: 'move',
          activeClass: 'active',
          hoverClass: 'hover',
          tolerance: 'pointer',
          drop: function(ev, ui) {

            bmmApi.userTrackCollectionLink($(this).attr('id'), [
              ui.draggable.attr('id')
            ]);

          }
        });

      });

    };

  });
