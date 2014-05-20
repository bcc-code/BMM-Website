'use strict';

angular.module('bmmApp')
  .controller('MusicCtrl', function (
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

          var cnt = 0;
          loading = true;

          //LATEST AUDIO ALBUMS
          bmmApi.albumLatest({
            from: albumFrom,
            size: loadAmount,
            'content-type': ['song'],
            'media-type': ['audio']
          }, bmmUser.mediaLanguage).done(function(data) {

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

      //LATEST MUSIC
      bmmApi.trackLatest({
        size: 10,
        'content-type': ['song'],
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
          $scope.latestMusicLeft = left;
          $scope.latestMusicRight = right;
          draggable.makeDraggable($scope);
        });

      });

      //LATEST AUDIO ALBUMS
      bmmApi.albumLatest({
        size: loadAmount,
        'content-type': ['song'],
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

        loading=false;

      });

      $scope.contributors = [];

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
        41644, //Dag Helge Bernhardsen
        60455, //Atle Johnsen
        51294, //Hanne Trinkle
        65006, //Ingrid Holm Andersen
        41621, //Jostein Østmoen
        49935, //Karethe Opitz
        50442, //Kristiane Opitz
        50440, //Linn Helgheim
        84408, //Liv Ragnhild Foltland
        61350, //Mads Jacobsen
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

        bmmApi.contributorIdGet(this).done(function(data) {

          if (data.cover!==null) {
            data.cover = bmmApi.secureFile(data.cover);
          }

          $scope.contributors.push(data);
          $scope.$apply();
        });
        if (index===3) {
          return false;
        }
      });

    };

  });
