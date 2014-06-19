'use strict';

angular.module('bmmApp')
  .controller('AlbumCtrl', function (
    $scope,
    $timeout,
    $routeParams,
    $location,
    $window,
    bmmApi,
    bmmFormatterAlbum,
    bmmFormatterTrack,
    init,
    bmmPlayer,
    bmmPlaylist
  ) {

    $(window).off('scrollBottom');

    // @analytics - Report page view to google analytics
    $scope.$on('$viewContentLoaded', function(event) {
      $window.ga('send', 'pageview', {
        'page': '/album',
        'title': 'Album'
      });
    });

    $scope.tracks = 0;
    $scope.playlist = [];
    $scope.duration = 0;
    $scope.playlists = [];
    $scope.mainAlbum = [];
    $scope.zip = {};
    $scope.zip.url = bmmApi.secureDownload(bmmApi.getserverUrli()+'album'+'/'+$routeParams.id+'/download');

    $scope.podcast = {};
    $scope.podcast.link = 'https://'+init.user.username+':'+
      init.user.token+'@'+
      bmmApi.getserverUrli().replace('https://','')+
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

    bmmApi.albumGet($routeParams.id, init.mediaLanguage).done(function(mainAlbum) {

      var track;
      var formattedAlbum = bmmFormatterAlbum.resolve(mainAlbum);

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

      $.each(mainAlbum.children, function() {

        if (typeof this.type !=='undefined') {

          if (this.type === 'track') {

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

            track = bmmFormatterTrack.resolve(this);
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

            bmmApi.albumGet(this.id, init.mediaLanguage).done(function(album) {

              var l = $scope.playlists.length, formattedAlbum = bmmFormatterAlbum.resolve(album);

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

                  track = bmmFormatterTrack.resolve(this);
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

              $('.bmm-playlist').trigger('dragdrop');
              findPlayingTrack();

            });

          }

        }

        $('.bmm-playlist').trigger('dragdrop');
        findPlayingTrack();

      });

      if ($scope.playlists[0].count===0) {
        $scope.playlists.splice(0,1);
      }

    });

    var findPlayingTrack = function() {
      if ($location.path()===bmmPlaylist.getUrl()) {
        $.each($scope.getPlaylistCopy($scope.languageFilter), function(index) {
          if (index===bmmPlaylist.index) {
            this.playing = true;
          } else {
            this.playing = false;
          }
        });
      }
    };

    //When new track is set
    $scope.player = bmmPlayer;
    $scope.$watch('player.trackSwitched', function() {
      findPlayingTrack();
    });

  });
