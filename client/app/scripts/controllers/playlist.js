'use strict';

angular.module('bmmApp')
  .controller('PlaylistCtrl', function (
    $scope,
    $rootScope,
    $routeParams,
    $timeout,
    $location,
    $window,
    _api,
    _track,
    _album,
    _init,
    _play,
    _player,
    _playlist
  ) {

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

    $scope.load = true;

    var loading=true, size, end=false, loadAmount=80;
    $scope.tracks = 0;
    $scope.duration = 0;
    $scope.podcast = {};
    $scope.zip = {};
    $scope.zip.show = false;
    $scope.albums = [];
    $scope.albumCount = 0;
    $scope.searchResults = false;
    $scope.path = $location.absUrl();
    $scope.showPodcast = false;

    $(window).off('scrollBottom');

    $scope.playlist = [];
    $scope.private = false;

    switch($routeParams.playlist) {
      case 'search':

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/search/?q='+$routeParams.id,
          'title': $routeParams.id
        });

        //Ensure search field has the term
        $scope.$parent.bmm = {};
        $scope.$parent.bmm.term = $routeParams.id;
        //Reset search field on leave
        $scope.$on('$destroy', function() {
          $scope.$parent.bmm.term = '';
        });

        $scope.searchResults = true;
        $scope.title = $routeParams.id;
        size = 0;

        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {

            loading = true;
            $scope.$apply(function() {
              $scope.load = true;
            });

            search($routeParams.id, size);

          }

        });

        var search = function(term, _from) {
          if (typeof from === 'undefined') {
            _from = 0;
          }
          _api.search(term, {
            from: _from,
            size: loadAmount
          }).done(function(data) {

            resolveTracks(data);
            size+=loadAmount;

          });
        };

        search($routeParams.id);
        var isInt = function(n) {
          n = parseInt(n);
          return isFinite(n) && n%1===0;
        };

        /*if (isInt($routeParams.id)&&$routeParams.id.length>0&&$routeParams.id.length<4) {
          search('hv '+$routeParams.id);
          search('mb '+$routeParams.id);
        }*/

        break;
      case 'latest':

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/playlist/latest',
          'title': 'Latest tracks'
        });

        $scope.title = _init.translation.playlist.latestTracks;
        size = 0;

        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {

            loading = true;
            $scope.$apply(function() {
              $scope.load = true;
            });

            _api.trackLatest({
              from: size,
              size: loadAmount
            }).done(function(data) {

              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        _api.trackLatest({
          size: loadAmount
        }).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        break;
      case 'private':

        $scope.zip.url = _api.secureDownload(_api.getserverUrli()+'track_collection'+'/'+$routeParams.id+'/download', true);
        $scope.zip.show = true;
        $scope.private = true;
        _api.userTrackCollectionGet($routeParams.id).done(function(data) {

          // @analytics - Report page view to google analytics
          $window.ga('send', 'pageview', {
            'page': '/playlist/private/'+$routeParams.id,
            'title': data.name
          });

          $scope.title = data.name;
          resolveTracks(data.tracks);

          $scope.sortableOptions = {
            update: function() {
              //Set timeout, so $scope.playlist get updated
              $timeout(function() {
                save();

                if ($location.path()===_playlist.getUrl()) {

                  var i = 0;
                  $.each($scope.playlist, function(index) {
                    if (this.playing) {
                      i = index;
                      return;
                    }
                  });

                  _play.setPlay($scope.playlist, i, false);

                }
              });
            }
          };

        });

        break;
      case 'mp3kilden':

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/playlist/mp3kilden',
          'title': 'Mp3-Kilden'
        });

        size = 0;
        $scope.title = _init.translation.page.music.mp3Source;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;

            $scope.$apply(function() {
              $scope.load = true;
            });

            _api.trackLatest({
              from: size,
              tags: ['mp3-kilden'],
              size: loadAmount
            }).done(function(data) {

              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        _api.trackLatest({
          size: loadAmount,
          tags: ['mp3-kilden']
        }).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        $timeout(function() {
          $rootScope.podcastHash = _api.getPodcastHash('/podcast/track/');
          $scope.podcast.link = _api.getserverUrli()+'podcast/track/?tags[]=mp3-kilden&';
          $scope.showPodcast = true;
        },1500);

        break;
      case 'barnasmp3':

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/playlist/barnasmp3',
          'title': 'Barnas Mp3-Kilde'
        });

        size = 0;
        $scope.title = _init.translation.page.music.childrensMp3Source;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $scope.$apply(function() {
              $scope.load = true;
            });

            _api.trackLatest({
              from: size,
              tags: ['child-favorites'],
              size: loadAmount
            }).done(function(data) {

              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        _api.trackLatest({
          size: loadAmount,
          tags: ['child-favorites']
        }).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        $timeout(function() {
          $rootScope.podcastHash = _api.getPodcastHash('/podcast/track/');
          $scope.podcast.link = _api.getserverUrli()+'podcast/track/?tags[]=child-favorites&';
          $scope.showPodcast = true;
        },1500);

        break;
      case 'instrumental':

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/playlist/instrumental',
          'title': 'Instrumental'
        });

        size = 0;
        $scope.title = _init.translation.playlist.instrumental;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $scope.$apply(function() {
              $scope.load = true;
            });

            _api.trackLatest({
              from: size,
              tags: ['instrumental'],
              size: loadAmount
            }).done(function(data) {

              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        _api.trackLatest({
          size: loadAmount,
          tags: ['instrumental']
        }).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        $timeout(function() {
          $rootScope.podcastHash = _api.getPodcastHash('/podcast/track/');
          $scope.podcast.link = _api.getserverUrli()+'podcast/track/?tags[]=instrumental&';
          $scope.showPodcast = true;
        },1500);

        break;
      case 'contributor':

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/playlist/contributor/'+$routeParams.id,
          'title': $routeParams.name
        });

        size = 0;
        $scope.title = $routeParams.name;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $scope.$apply(function() {
              $scope.load = true;
            });

            _api.contributorTracksGet($routeParams.id, {
              from: size,
              size: loadAmount
            }).done(function(data) {

              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        _api.contributorTracksGet($routeParams.id, {
          size: loadAmount
        }).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        $timeout(function() {
          $rootScope.podcastHash = _api.getPodcastHash('/podcast/contributor/'+$routeParams.id+'/track/');
          $scope.podcast.link = _api.getserverUrli()+'podcast/contributor/'+$routeParams.id+'/track/?';
          $scope.showPodcast = true;
        },1500);

        break;
    }

    var resolveTracks = function(data) {

      var track, cnt=0;

      $scope.$apply(function() {

        $.each(data, function(index) {

          if (this.type==='album') {
            $scope.albums.push(_album.resolve(this));
            $scope.albumCount++;
            cnt++;
          } else {

            track = _track.resolve(this);

            if ($routeParams.playlist!=='private') {
              track.order = track.date;
            } else {
              track.order = index;
            }

            if (track.type==='video') {
              track.video = true;
            }

            $scope.playlist.push(track);

            if (typeof track.duration!=='undefined'&&
                $.isNumeric(track.duration)) {
              $scope.duration+=track.duration;
            }
            $scope.tracks++;
            cnt++;

          }

        });

        $timeout(function() {
          $('.draggable-playlist').trigger('dragdrop');
          loading = false;
          $scope.load = false;
        });

        findPlayingTrack();
        if (cnt<loadAmount) { end = true; } else {
          //If multiple requests is sendt and one request isnt finished, then end is false
          //A timeout here will make sure that 'end = false' is choosen if any is request isnt finished.
          $timeout(function() { end = false; }, 500);
        }

      });

    };

    $scope.remove = function(index) {
      if (typeof index!=='undefined') {
        $scope.playlist.splice(index,1);
      }
      save();
    };

    var save = function() {

      var playlist = [];

      $.each($scope.playlist, function() {
        playlist.push({
          id: this.id,
          language: this.language
        });
      });

      _api.userTrackCollectionPut($routeParams.id ,{
        type: 'track_collection',
        track_references: playlist,
        access: [_init.user.username],
        name: $scope.title
      });

    };

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
