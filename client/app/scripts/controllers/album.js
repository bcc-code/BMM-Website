'use strict';

angular.module('bmmApp')
  .controller('AlbumCtrl', function (
    $scope,
    $routeParams,
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
    $scope.tracks = 0;
    $scope.playlist = [];
    $scope.duration = 0;
    $scope.playlists = [];
    $scope.mainAlbum = [];
    $scope.zip = {};
    $scope.zip.url = _api.secureDownload(_api.getserverUrli()+'album'+'/'+$routeParams.id+'/download', true);
    $scope.path = $location.absUrl();

    $scope.podcast = {};
    $scope.podcast.link = 'https://'+_init.user.username+':'+
      _init.user.token+'@'+
      _api.getserverUrli().replace('https://','')+
      'podcast/album/'+$routeParams.id+'/track/?';

    $scope.getPlaylistCopy = function(filter) {
      var array = [];
      $.each($scope.playlist, function() {
        if (typeof filter!=='undefined'&&filter!=='') {
          if (this.language===filter) {
            array.push(this);
          }
        } else {
          array.push(this);
        }
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
        duration: 0,
        tracks: [],
        count: 0
      };

      $scope.playlists.push({
        title: '',
        description: formattedAlbum.description,
        id: formattedAlbum.id,
        cover: formattedAlbum.cover,
        duration: 0,
        tracks: [],
        count: 0
      });

      var ct = mainAlbum.children.length;

      $.each(mainAlbum.children, function() {

        if (typeof this.type !=='undefined') {

          if (this.type === 'track') {

            ct--;

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

            if (track.type==='video') {
              track.video = true;
            }

            $scope.$apply(function() {
              $scope.playlists[0].tracks.push(track);
              $scope.playlist.push(track);
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

                  if (track.type==='video') {
                    track.video = true;
                  }

                  $scope.$apply(function() {
                    $scope.playlists[l].tracks.push(track);
                    $scope.playlist.push(track);
                    $scope.playlists[l].duration+=track.duration;
                    $scope.playlists[l].count++;
                    $scope.tracks++;
                  });

                } //If not track, dont display (will only display one level up)

              });

              if (ct===0) {
                $('.bmm-playlist').trigger('dragdrop');
                findPlayingTrack();
                $scope.load = false;
              }

            });

          }

        }

        if (ct===0) {
          $('.bmm-playlist').trigger('dragdrop');
          findPlayingTrack();
          $scope.load = false;
        }

      });

      if ($scope.playlists[0].count===0) {
        $scope.playlists.splice(0,1);
      }

    });

    var findPlayingTrack = function() {
      if ($location.path()===_playlist.getUrl()) {
        $.each($scope.getPlaylistCopy($scope.languageFilter), function(index) {
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
