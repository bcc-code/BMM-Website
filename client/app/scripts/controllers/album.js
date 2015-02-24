'use strict';

angular.module('bmmApp')
  .controller('AlbumCtrl', function (
    $scope,
    $rootScope,
    $routeParams,
    $filter,
    $location,
    $window,
    _api,
    _album,
    _track,
    _init,
    _player,
    _playlist
  ) {

    $(window).off('scrollBottom');

    // @analytics - Report page view to google analytics
    $scope.$on('$viewContentLoaded', function() {
      $window.ga('send', 'pageview', {
        'page': '/album',
        'title': 'Album'
      });
    });

    $scope.load = true;
    $scope.parentAlbum = { found: false };
    $scope.tracks = 0;
    $scope.playlist = [];
    $scope.playlists = [];
    $scope.duration = 0;
    $scope.mainAlbum = [];
    $scope.zip = {};
    $scope.zip.url = _api.secureDownload(_api.getserverUrli()+'album'+'/'+$routeParams.id+'/download', true);
    $scope.path = $location.absUrl();

    $scope.podcast = {};
    $rootScope.podcastHash = _api.getPodcastHash('/podcast/album/'+$routeParams.id+'/track/');
    $scope.podcast.link = _api.getserverUrli()+'podcast/album/'+$routeParams.id+'/track/?';

    $scope.getPlaylistCopy = function(filter, playlist) {
      var array = [];
      $.each($scope.playlists, function() {
        $.each(this.tracks, function() {
          if (typeof filter !== 'undefined' && filter !== '') {
            if (this.language === filter) {
              array.push(this);
            }
          } else {
            array.push(this);
          }
        });
      });
      return array;
    };

    _api.albumGet($routeParams.id, _init.contentLanguage).done(function(mainAlbum) {

      var track;
      var formattedAlbum = _album.resolve(mainAlbum);

      $scope.mainAlbum = {
        title: formattedAlbum.title,
        description: formattedAlbum.description,
        id: formattedAlbum.id,
        cover: formattedAlbum.cover,
        date: mainAlbum.published_at,
        duration: 0,
        tracks: [],
        count: 0
      };

      $scope.playlists.push({
        title: '',
        description: formattedAlbum.description,
        id: formattedAlbum.id,
        cover: formattedAlbum.cover,
        date: mainAlbum.published_at,
        duration: 0,
        tracks: [],
        count: 0
      });

      if (mainAlbum.parent_id!==null) {
        _api.albumGet(mainAlbum.parent_id, _init.contentLanguage).done(function(album) {

          $scope.$apply(function() {

            $scope.parentAlbum = album;
            $scope.parentAlbum.found = true;

          });

        });
      }

      var ct = mainAlbum.children.length;

      $.each(mainAlbum.children, function() {

        if (typeof this.type !=='undefined') {

          if (this.type === 'track') {

            ct--;

            /* Find cover */
            if (typeof this.cover==='undefined'||this.cover===null) {
              if (typeof mainAlbum.cover!=='undefined'&&mainAlbum.cover!==null) {
                this.cover = mainAlbum.cover;
              } else {
                //Check for root album
                if (typeof mainAlbum._meta!=='undefined'&&
                    typeof mainAlbum._meta.parent!=='undefined'&&
                    typeof mainAlbum._meta.parent.cover!=='undefined'&&
                    typeof mainAlbum._meta.parent.cover!==null) {
                  this.cover = mainAlbum._meta.parent.cover;
                }
              }
            }

            track = _track.resolve(this);
            track.albumTitle = formattedAlbum.title;
            track.albumId = formattedAlbum.id;
            track.albumDate = mainAlbum.published_at;

            if (track.type==='video') {
              track.video = true;
            }

            $scope.$apply(function() {
              $scope.playlists[0].tracks.push(track);
              $scope.playlists[0].duration+=track.duration;
              $scope.playlists[0].count++;
              $scope.tracks++;
            });

          } else if (this.type === 'album') {

            _api.albumGet(this.id, _init.contentLanguage).done(function(album) {

              ct--;

              var l = $scope.playlists.length, formattedAlbum = _album.resolve(album);

              $scope.$apply(function() {
                $scope.playlists[l] = {
                  title: formattedAlbum.title,
                  description: formattedAlbum.description,
                  id: formattedAlbum.id,
                  cover: formattedAlbum.cover,
                  date: album.published_at,
                  duration: 0,
                  tracks: [],
                  count: 0
                };
              });

              $.each(album.children, function() {

                if (this.type === 'track') {

                  if (typeof this.cover==='undefined'||this.cover===null) {
                    if (typeof album.cover!=='undefined'&&album.cover!==null) {
                      this.cover = album.cover;
                    } else {
                      //Check for root album
                      if (typeof album._meta!=='undefined'&&
                          typeof album._meta.parent!=='undefined'&&
                          typeof album._meta.parent.cover!=='undefined'&&
                          typeof album._meta.parent.cover!==null) {
                        this.cover = album._meta.parent.cover;
                      }
                    }
                  }

                  track = _track.resolve(this);
                  track.albumTitle = formattedAlbum.title;
                  track.albumId = formattedAlbum.id;
                  track.albumDate = album.published_at;

                  if (track.type==='video') {
                    track.video = true;
                  }

                  $scope.$apply(function() {
                    $scope.playlists[l].tracks.push(track);
                    $scope.playlists[l].duration+=track.duration;
                    $scope.playlists[l].count++;
                    $scope.tracks++;
                  });

                } //If not track, dont display (will only display one level up)

              });

              /*album recorded at, album id, order id*/

              if (ct===0) {
                resolveAlbums();
              }

            });

          }

        }

        if (ct===0) {
          resolveAlbums();
        }

      });

      if ($scope.playlists[0].count===0) {
        $scope.playlists.splice(0,1);
      }

    });

    var resolveAlbums = function() {
      $scope.playlist = $scope.playlists[0].tracks;
      $scope.$apply(function() {
        $scope.playlists = $filter('orderBy')($scope.playlists, ('date'));
        $scope.playlist = $filter('orderBy')($scope.playlist, ('albumId', 'albumDate', 'raw.order'));
        $scope.load = false;
      });

      $('.draggable-playlist').trigger('dragdrop');

      findPlayingTrack();
    };

    var findPlayingTrack = function() {
      if ($location.path()===_playlist.getUrl()) {

        $.each($scope.playlists, function() {
          $.each(this.tracks, function() {
            this.playing = false;
          });
        });

        $.each($scope.getPlaylistCopy($scope.languageFilter, $scope.playlist), function(index) {
          if (index===_playlist.index) {
            this.playing = true;
          } else {
            this.playing = false;
          }
        });
      }
    };

    //When new track is set
    $scope.player = _player;
    $scope.$watch('player.trackSwitched', function() {
      findPlayingTrack();
    });

  });
