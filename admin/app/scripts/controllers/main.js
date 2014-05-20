'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $location,
    $route,
    init,
    bmmApi,
    bmmPlay,
    bmmFormatterAlbum
  ) {

    init.load.complete.promise.then(function() {

      $('.bmm-view').off('scrollBottom');

      $scope.user = init.user;
      $scope.root = init.root;
      $scope.translation = init.translation;
      $scope.mediaLanguage = init.mediaLanguage;
      $scope.titles = init.titles;
      $scope.ios = init.ios;

      $scope.setMediaLanguage = function(lang) {
        init.mediaLanguage = lang;
        $route.reload();
      };

      $scope.go = function ( path ) {
        $location.path( path );
      };

      $scope.play = function(playlist, index) {
        bmmPlay.setPlay(playlist, index);
      };

      //FETCH YEARS
      $scope.years = [];
      bmmApi.facetsAlbumPublishedYears({
        unpublished: 'show'
      }).done(function(years) {

        $scope.$apply(function() {
          $scope.year = [];
          $scope.years = [];
          $.each(years, function() {
            $scope.years.push(this.year);
          });
          $scope.years.reverse();
        });

      });

      //FETCH ALBUMS
      $scope.albums = [];
      $scope.findAlbums = function(year) {
        bmmApi.albumPublishedYear(year, {
          unpublished: 'show'
        }, init.mediaLanguage).done(function(albums) {

          $scope.$apply(function() {
            $scope.albums = [];
            $.each(albums, function() {
              var album = bmmFormatterAlbum.resolve(this);
              $scope.albums.push(album);
            });
            $scope.albums.reverse();
          });

        });
      };

      //FETCH CHILD-ALBUMS
      $scope.childAlbums = [];
      $scope.findChildAlbums = function(id) {
        bmmApi.albumGet(id, init.mediaLanguage, {
          unpublished: 'show'
        }).done(function(data) {

          $scope.$apply(function() {
            $scope.childAlbum = [];
            $scope.childAlbums = [];
            $.each(data.children, function() {
              if (typeof this.type!=='undefined'&&this.type==='album') {
                $scope.childAlbums.push(bmmFormatterAlbum.resolve(this));
              }
            });
            $scope.albums.reverse();
          });

        });
      };

      $(window).bind('scroll', function() {
        if($(window).scrollTop() + $(window).height()>=$(document).height()) {
          $(window).trigger('scrollBottom');
        }
      });

    });

  });
