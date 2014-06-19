'use strict';

angular.module('bmmApp')
  .controller('AudiobooksCtrl', function (
    $scope,
    $timeout,
    $window,
    bmmApi,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    init,
    draggable
  ) {

    $(window).off('scrollBottom');

    // @analytics - Report page view to google analytics
    $scope.$on('$viewContentLoaded', function(event) {
      $window.ga('send', 'pageview', {
        'page': '/audiobooks',
        'title': 'Audiobooks'
      });
    });

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
      size: 15,
      'content-type': ['audiobook'],
      'media-type': ['audio']
    }, init.mediaLanguage).done(function(data) {

      var left = [], right = [], largeOnly = [];

      $.each(data, function(index) {

        if (index<5) {
          left.push(bmmFormatterTrack.resolve(this));
        } else if (index<10) {
          right.push(bmmFormatterTrack.resolve(this));
        } else {
          largeOnly.push(bmmFormatterTrack.resolve(this));
        }

      });

      $scope.$apply(function() {
        $scope.latestAudiobookLeft = left;
        $scope.latestAudiobookRight = right;
        $scope.latestAudiobookLargeOnly = largeOnly;
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
