'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $location,
    $route,
    init,
    bmmApi,
    bmmPlay,
    bmmFormatterAlbum,
    bmmFormatterTrack,
    quickMenu
  ) {

    $scope.load = init.load;

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
          $scope.tracks = [];
          $scope.childAlbums = [];
          $scope.childTracks = [];
          $.each(years, function() {
            $scope.years.push(this.year);
          });
          $scope.years.reverse();
        });

      });

      //FETCH ALBUMS
      $scope.albums = [];
      $scope.findAlbums = function(year, options) {
        bmmApi.albumPublishedYear(year, {
          unpublished: 'show'
        }, init.mediaLanguage).done(function(albums) {

          $scope.$apply(function() {
            $scope.albums = [];
            $scope.tracks = [];
            $scope.childAlbums = [];
            $scope.childTracks = [];
            $.each(albums, function() {
              var album = bmmFormatterAlbum.resolve(this);
              $scope.albums.push(album);
            });
            $scope.albums.reverse();
          });

          if (typeof options!=='undefined') {
            options.done();
          };

        });
      };

      //FETCH TRACKS
      $scope.tracks = [];
      $scope.findTracks = function(id) {
        bmmApi.albumGet(id, init.mediaLanguage, {
          unpublished: 'show'
        }).done(function(data) {

          $scope.$apply(function() {
            $scope.track = [];
            $scope.tracks = [];
            $.each(data.children, function() {
              if (typeof this.type!=='undefined'&&this.type==='track') {
                $scope.tracks.push(bmmFormatterTrack.resolve(this));
              }
            });
          });

        });
      };

      //FETCH CHILD-ALBUMS
      $scope.childAlbums = [];
      $scope.findChildAlbums = function(id, options) {
        bmmApi.albumGet(id, init.mediaLanguage, {
          unpublished: 'show'
        }).done(function(data) {

          $scope.$apply(function() {
            $scope.childAlbum = [];
            $scope.childAlbums = [];
            $scope.childTracks = [];
            $.each(data.children, function() {
              if (typeof this.type!=='undefined'&&this.type==='album') {
                var album = bmmFormatterAlbum.resolve(this);
                $scope.childAlbums.push(album);
              }
            });
            $scope.childAlbums.reverse();
          });

          if (typeof options!=='undefined') {
            options.done();
          };

        });
      };

      //FETCH CHILD-TRACKS
      $scope.childTracks = [];
      $scope.findChildTracks = function(id) {
        bmmApi.albumGet(id, init.mediaLanguage, {
          unpublished: 'show'
        }).done(function(data) {

          $scope.$apply(function() {
            $scope.childTrack = [];
            $scope.childTracks = [];
            $.each(data.children, function() {
              if (typeof this.type!=='undefined'&&this.type==='track') {
                $scope.childTracks.push(bmmFormatterTrack.resolve(this));
              }
            });
          });

        });
      };

      //AUTOOPEN QUICK MENU
      var autoOpen = function(year, rootId, parentId) {

        $scope.year = year

        $scope.findAlbums(year, {
          done: function() {

            $.each($scope.albums, function() {
              if (this.id === rootId) {
                $scope.album = this;
                return false;
              }
            });

            $scope.findTracks(rootId);

            $scope.findChildAlbums(rootId, {
              done: function() {

                if (typeof parentId!=='undefined') {

                  $.each($scope.childAlbums, function() {
                    if (this.id === parentId) {
                      $scope.albumChild = this;
                      return false;
                    }
                  });

                  $scope.findChildTracks(parentId);

                }

              }
            });

          }
        })

      };

      $scope.quickMenu = quickMenu;
      $scope.$watch('quickMenu.menu', function(menu) {
        if (!menu.parentId===false) {
          autoOpen(Number(menu.year), menu.rootId, menu.parentId);
        } else {
          autoOpen(Number(menu.year), menu.rootId);
        }
      }, true);

      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

      $(window).bind('scroll', function() {
        if($(window).scrollTop() + $(window).height()>=$(document).height()) {
          $(window).trigger('scrollBottom');
        }
      });

    });

  });
