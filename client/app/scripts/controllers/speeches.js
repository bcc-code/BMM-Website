'use strict';

angular.module('bmmApp')
  .controller('SpeechesCtrl', function (
    $scope,
    $window,
    _api,
    _track,
    _album,
    _init,
    _draggable
  ) {

    $scope.latestSpeeches = [];

    $scope.latestSpeechesColHeight = 5;

    $(window).off('scrollBottom');

    $scope.load = true;

    var albumFrom = 0, loading=true, end=false, loadAmount=84;

    $(window).on('scrollBottom', function() {

      if (!loading&&!end) {

        //$('[ng-view]').append('<div class="bmm-loading">'+_init.translation.general.loading+'</div>');

        loading = true;
        $scope.$apply(function() {
          $scope.load = true;
        });

        //LATEST SPEECH ALBUMS
        _api.albumLatest({
          from: albumFrom,
          size: loadAmount,
          'content-type': ['speech'],
          'media-type': ['audio']
        }).done(function(data) {

          var cnt=0;

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

    //AUTOCOMPLETION
    $scope.$watch('contributor', function(name) {
      if (name!==''&&typeof name!=='undefined') {
        _api.contributorSuggesterCompletionGet(name).done(function(data) {
          $scope.$apply(function() {
            $scope.contributors = data;
          });
        });
      } else {
        $scope.contributors = $scope.randomBrothers;
      }
    });

    //LATEST SPEECHS
    _api.trackLatest({
      size: 15,
      'content-type': ['speech'],
      'media-type': ['audio']
    }).done(function(data) {
      $scope.$apply(function() {
        $scope.latestSpeeches = data.map(function(trackData) {
          return _track.resolve(trackData);
        });

        _draggable.makeDraggable($scope);
      });
    });

    //LATEST SPEECH ALBUMS
    _api.albumLatest({
      from: albumFrom,
      size: loadAmount,
      'content-type': ['speech'],
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

    //FETCH INTERPRETS
    $scope.randomBrothers = [];

    //Kåre J. Smith
    _api.contributorIdGet(36491).done(function(data) {

      $scope.randomBrothers.push(data);

      //3 will randomly be selected and shown
      var randomBrothers = [
        36514, //Arild Tombre
        36515, //Gunnar Gangsø
        36503, //Bjørn Nilsen
        36517, //Sverre Riksfjord
        36562, //Gershon Twilley
        36501, //Bernt Stadven
        49489, //Elias Aslaksen
        //36529, //Thorbjørn Vedvik
        36522, //Harald Kronstad
        36519  //Trond Eriksen
      ];

      //Randomize function
      var shuffle = function(o) {
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){}
        return o;
      };

      //Catch 3 contributors
      randomBrothers = shuffle(randomBrothers);
      $.each(randomBrothers, function(index) {
        _api.contributorIdGet(this).done(function(data) {

          if (data.cover!==null) {
            data.cover = _api.secureImage(data.cover);
          }

          $scope.randomBrothers.push(data);
          $scope.contributors = $scope.randomBrothers;
          $scope.$apply();
        });
        if (index===2) {
          return false;
        }
      });

    });

  });
