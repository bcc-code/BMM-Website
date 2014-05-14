'use strict';

angular.module('bmmApp')
  .controller('SpeechesCtrl', function (
    $scope,
    $timeout,
    bmmApi,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    bmmUser,
    draggable
  ) {

    //Temporary solution. @todo - Dig into '$routeProvider & resolve' for a better solution
    $scope.$parent.$watch('loadEnd', function(loadEnd) {
      if (loadEnd) {
        init();
      }
    });

    var init = function() {

      $(window).off('scrollBottom');

      var albumFrom = 0, loading=true, end=false, loadAmount=84;

      $(window).on('scrollBottom', function() {

        if (!loading&&!end) {

          $('[ng-view]').append('<div class="bmm-loading">Laster...</div>');

          loading = true;

          //LATEST SPEECH ALBUMS
          bmmApi.albumLatest({
            from: albumFrom,
            size: loadAmount,
            'content-type': ['speech'],
            'media-type': ['audio']
          }, bmmUser.mediaLanguage).done(function(data) {

            var cnt=0;

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

      //LATEST SPEECHS
      bmmApi.trackLatest({
        size: 10,
        'content-type': ['speech'],
        'media-type': ['audio']
      }, bmmUser.mediaLanguage).done(function(data) {

        var left = [], right = [];

        $.each(data, function(index) {

          if (index<5) {
            left.push(bmmFormatterTrack.resolve(this));
          } else {
            right.push(bmmFormatterTrack.resolve(this));
          }

        });

        $scope.$apply(function() {
          $scope.latestSpeechLeft = left;
          $scope.latestSpeechRight = right;
          draggable.makeDraggable($scope);
        });

      });

      //LATEST SPEECH ALBUMS
      bmmApi.albumLatest({
        from: albumFrom,
        size: loadAmount,
        'content-type': ['speech'],
        'media-type': ['audio']
      }, bmmUser.mediaLanguage).done(function(data) {

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

      //FETCH INTERPRETS
      $scope.contributors = [];

      //Kåre J. Smith
      bmmApi.contributorIdGet(36491).done(function(data) {

        $scope.contributors.push(data);

        //3 will randomly be selected and shown
        var randomBrothers = [
          36514, //Arild Tombre
          36515, //Gunnar Gangsø
          36503, //Bjørn Nilsen
          36517, //Sverre Riksfjord
          36562, //Gershon Twilley
          36501, //Bernt Stadven
          49489, //Elias Aslaksen
          36529, //Thorbjørn Vedvik
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
          bmmApi.contributorIdGet(this).done(function(data) {
            $scope.contributors.push(data);
            $scope.$apply();
          });
          if (index===2) {
            return false;
          }
        });

      });

    };

  });
