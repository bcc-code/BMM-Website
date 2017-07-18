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
    $scope.zip = {};
    $scope.zip.show = false;
    $scope.albums = [];
    $scope.albumCount = 0;
    $scope.searchResults = false;
    $scope.path = $location.absUrl();

    $(window).off('scrollBottom');

    $scope.playlist = [];
    $scope.private = false;

    var findPlayingTrack = function() {
      if ($location.path()===_playlist.getUrl()) {

        $.each($scope.getPlaylistCopy($scope.languageFilter), function(index) {
          this.playing = (index === _playlist.index);
        });

      }
    };

    var resolveTracks = function(data) {

      var track, cnt=0;

      $rootScope.safeApply(function() {

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

    switch($routeParams.playlist) {
      case 'search':

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

        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {

            loading = true;
            $rootScope.safeApply(function() {
              $scope.load = true;
            });

            search($routeParams.id, size);

          }

        });

        search($routeParams.id);
        break;
      case 'latest':

        $scope.title = _init.translation.playlist.latestTracks;
        size = 0;

        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {

            loading = true;
            $rootScope.safeApply(function() {
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

        $scope.zip.url = _api.getserverUrli()+'track_collection'+'/'+$routeParams.id+'/download';
        $scope.zip.show = true;
        $scope.private = true;
        _api.userTrackCollectionGet($routeParams.id).done(function(data) {

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
      case 'podcast':
        size = 0;

        $scope.title = $routeParams.name;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $rootScope.safeApply(function() {
              $scope.load = true;
            });

            _api.podcastTracksGet($routeParams.id, {
              from: size,
              size: loadAmount
            }).done(function(data) {

              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        _api.podcastTracksGet($routeParams.id, {
          size: loadAmount
        }).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        break;
      case 'contributor':

        size = 0;
        $scope.title = $routeParams.name;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $rootScope.safeApply(function() {
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

        break;
    }

    $scope.remove = function(index) {
      if (typeof index!=='undefined') {
        $scope.playlist.splice(index,1);
      }
      save();
    };

    //When new track is set
    $scope.player = _player;
    $scope.$watch('player.trackSwitched', function() {
      findPlayingTrack();
    });

  });
