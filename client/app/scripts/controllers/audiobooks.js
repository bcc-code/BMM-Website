'use strict';

angular.module('bmmApp')
  .controller('AudiobooksCtrl', function (
    $scope,
    $timeout,
    bmmApi,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    init,
    draggable
  ) {

    $(window).off('scrollBottom');

    var albumFrom = 0, loading=true, end=false, loadAmount=84;

    $(window).on('scrollBottom', function() {

      if (!loading&&!end) {

        $('[ng-view]').append('<div class="bmm-loading">'+init.translation.general.loading+'</div>');

        var cnt = 0;
        loading = true;

        //LATEST AUDIOBOOK ALBUMS
        bmmApi.albumLatest({
          from: albumFrom,
          size: loadAmount,
          'content-type': ['audiobook'],
          'media-type': ['audio']
        }, init.mediaLanguage).done(function(data) {

          $.each(data, function() {

            $scope.latestAlbums.push(bmmFormatterAlbum.resolve(this));
            albumFrom++;
            cnt++;

          });

          $scope.$apply();

          loading = false;
          $('.bmm-loading').remove();
          if (cnt<loadAmount) { end = true; }

        });

      }

    });

    //LATEST AUDIOBOOKS
    bmmApi.trackLatest({
      size: 10,
      'content-type': ['audiobook'],
      'media-type': ['audio']
    }, init.mediaLanguage).done(function(data) {

      var left = [], right = [];

      $.each(data, function(index) {

        if (index<5) {
          left.push(bmmFormatterTrack.resolve(this));
        } else {
          right.push(bmmFormatterTrack.resolve(this));
        }

      });

      $scope.$apply(function() {
        $scope.latestAudiobookLeft = left;
        $scope.latestAudiobookRight = right;
        draggable.makeDraggable($scope);
      });

    });

    //LATEST SPEECH ALBUMS
    bmmApi.albumLatest({
      size: loadAmount,
      'content-type': ['audiobook'],
      'media-type': ['audio']
    }, init.mediaLanguage).done(function(data) {

      var albums=[];

      $.each(data, function() {

        albums.push(bmmFormatterAlbum.resolve(this));
        albumFrom++;

      });

      $scope.$apply(function() {
        $scope.latestAlbums = albums;
      });

      loading = false;

    });

  });
