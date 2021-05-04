'use strict';

angular.module('bmmApp')
  .controller('MusicCtrl', function (
    $scope,
    $window,
    $rootScope,
    _api,
    _track,
    _album,
    _init,
    _draggable
  ) {

    $scope.latestMusic = [];

    $scope.latestMusicColHeight = 5;
    $scope.curatedPlaylists = [];

    $(window).off('scrollBottom');

    $scope.load = true;

    var albumFrom = 0, loading=true, end=false, loadAmount=84;

    $(window).on('scrollBottom', function() {

      if (!loading&&!end) {

        //$('[ng-view]').append('<div class="bmm-loading">'+_init.translation.general.loading+'</div>');
        $rootScope.safeApply(function() {
          $scope.load = true;
        });

        var cnt = 0;
        loading = true;

        //LATEST AUDIO ALBUMS
        _api.albumLatest({
          from: albumFrom,
          size: loadAmount,
          'content-type': ['song'],
          'media-type': ['audio']
        }).done(function(data) {

          $.each(data, function() {

            $scope.latestAlbums.push(_album.resolve(this));
            albumFrom++;
            cnt++;

          });

          $scope.load = false;

          loading = false;
          //$('.bmm-loading').remove();

          if (cnt<loadAmount) { end = true; }

        });

      }

    });

    //AUTOCOMPLETION
    $scope.$watch('contributor', function(name) {
      if (name!==''&&typeof name!=='undefined') {
        _api.contributorSuggesterCompletionGet(name).done(function(data) {
          $scope.contributors = data;
        });
      } else {
        $scope.contributors = $scope.randomArtists;
      }
    });

    //LATEST MUSIC
    _api.trackLatest({
      size: 15,
      'content-type': ['song'],
      'media-type': ['audio']
    }).done(function(data) {
      $scope.latestMusic = data.map(function(trackData) {
        return _track.resolve(trackData);
      });

      _draggable.makeDraggable($scope);
    });

    //CURATED PLAYLISTS
    _api.playlistsGet().done(function(data) {
      $scope.curatedPlaylists = data;
    });

    //LATEST AUDIO ALBUMS
    _api.albumLatest({
      size: loadAmount,
      'content-type': ['song'],
      'media-type': ['audio']
    }).done(function(data) {

      var albums=[];

      $.each(data, function() {

        albums.push(_album.resolve(this));
        albumFrom++;

      });

      $scope.latestAlbums = albums;
      $scope.load = false;

      loading=false;

    });

    $scope.randomArtists = [];

    //4 will randomly be selected and shown
    var randomBrothers = [
      65224, //Jermund Pedersen
      59268, //Astrid Reinhardt
      45275, //Gjermund Frivold
      81631, //Rebekka Frivold
      75152, //Elisa Frivold
      59596, //Oliver Tangen
      43806, //Alise Helgheim
      64808, //Pia Veronica Jacobsen
      80142, //Pia Gjøsund
      41600, //Dag Helge Bernhardsen
      60455, //Atle Johnsen
      51294, //Hanne Trinkle
      41576, //Ingrid Holm Andersen
      41598, //Jostein Østmoen
      49935, //Karethe Opitz
      49933, //Kristiane Opitz
      45272, //Linn Helgheim
      41622, //Liv Ragnhild Fotland
      60845, //Marte Hannson
      60844  //Vegar Sandberg
    ];

    //Randomize function
    var shuffle = function(o) {
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){}
      return o;
    };

    //Catch 4 contributors
    randomBrothers = shuffle(randomBrothers);
    $.each(randomBrothers, function(index) {

      _api.contributorIdGet(this).done(function(data) {

        if (data.cover!==null) {
          data.cover = _api.secureImage(data.cover);
        }

        $scope.randomArtists.push(data);
        $scope.contributors = $scope.randomArtists;
      });
      if (index===3) {
        return false;
      }
    });

  });
