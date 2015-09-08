'use strict';

angular.module('bmmApp')
  .controller('AudiobooksCtrl', function (
    $scope,
    $window,
    _api,
    _track,
    _album,
    _init,
    _draggable
  ) {

    $scope.latestAudiobook = [];

    $scope.latestAudiobookColHeight = 5;

    $(window).off('scrollBottom');

    $scope.load = true;

    var albumFrom = 0, loading=true, end=false, loadAmount=84;

    $(window).on('scrollBottom', function() {

      if (!loading&&!end) {

        //$('[ng-view]').append('<div class="bmm-loading">'+_init.translation.general.loading+'</div>');
        $scope.$apply(function() {
          $scope.load = true;
        });

        var cnt = 0;
        loading = true;

        //LATEST AUDIOBOOK ALBUMS
        _api.albumLatest({
          from: albumFrom,
          size: loadAmount,
          'content-type': ['audiobook'],
          'media-type': ['audio']
        }).done(function(data) {

          $.each(data, function() {

            $scope.latestAlbums.push(_album.resolve(this));
            albumFrom++;
            cnt++;

          });

          $scope.$apply(function() {
            $scope.load = false;
          });

          loading = false;
          //$('.bmm-loading').remove();
          if (cnt<loadAmount) { end = true; }

        });

      }

    });

    //LATEST AUDIOBOOKS
    _api.trackLatest({
      size: 15,
      'content-type': ['audiobook'],
      'media-type': ['audio']
    }).done(function(data) {
      $scope.$apply(function() {
        $scope.latestAudiobook = data.map(function(trackData) {
          return _track.resolve(trackData);
        });

        _draggable.makeDraggable($scope);
      });
    });

    //LATEST SPEECH ALBUMS
    _api.albumLatest({
      size: loadAmount,
      'content-type': ['audiobook'],
      'media-type': ['audio']
    }).done(function(data) {

      var albums=[];

      $.each(data, function() {

        albums.push(_album.resolve(this));
        albumFrom++;

      });

      $scope.$apply(function() {
        $scope.latestAlbums = albums;
        $scope.load = false;
      });

      loading = false;

    });

  });
