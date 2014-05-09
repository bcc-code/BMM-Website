'use strict';

angular.module('bmmApp')
  .controller('PlaylistCtrl', function (
    $scope,
    $routeParams,
    $timeout,
    $location,
    bmmApi,
    bmmFormatterTrack,
    bmmUser,
    bmmPlay,
    bmmPlayer,
    bmmPlaylist
  ) {

    //Temporary solution. @todo - Dig into $routeProvider & resolve for a better solution
    $scope.$parent.$watch('loadEnd', function(loadEnd) {
      if (loadEnd) {
        init();
      }
    });

    var init = function() {

      var loading=true, size, end=false, loadAmount=80;
      $scope.tracks = 0;
      $scope.duration = 0;
      $scope.podcast = {};
      $scope.podcast.isset = false;
      $scope.zip = {};
      $scope.zip.show = false;

      $(window).off('scrollBottom');

      $scope.playlist = [];
      $scope.private = false;

      switch($routeParams.playlist) {
        case 'latest':

          $scope.title = 'Siste tracks';
          size = 0;

          $(window).on('scrollBottom', function() {

            if (!loading&&!end) {

              loading = true;
              $('[ng-view]').append('<div class="bmm-loading">Laster...</div>');

              bmmApi.trackLatest({
                from: size,
                size: loadAmount
              }, bmmUser.mediaLanguage).done(function(data) {

                $('.bmm-loading').remove();
                resolveTracks(data, size);
                size+=loadAmount;

              });

            }

          });

          bmmApi.trackLatest({
            size: loadAmount
          }, bmmUser.mediaLanguage).done(function(data) {

            resolveTracks(data);
            size+=loadAmount;

          });

          break;
        case 'private':

          $scope.zip.url = bmmApi.getserverUrli()+'track_collection'+'/'+$routeParams.id+'/download';
          $scope.zip.show = true;
          $scope.private = true;
          bmmApi.userTrackCollectionGet($routeParams.id).done(function(data) {

            $scope.title = data.name;
            resolveTracks(data.tracks);

            $scope.sortableOptions = {
              update: function() {
                //Set timeout, so $scope.playlist get updated
                $timeout(function() {
                  save();

                  if ($location.path()===bmmPlaylist.getUrl()) {

                    var i = 0;
                    $.each($scope.playlist, function(index) {
                      if (this.playing) {
                        i = index;
                        return;
                      }
                    });

                    bmmPlay.setPlay($scope.playlist, i, false);

                  }
                });
              }
            };

          });

          break;
        case 'mp3kilden':

          size = 0;
          $scope.title = 'Mp3 kilden';
          $(window).on('scrollBottom', function() {

            if (!loading&&!end) {
              loading = true;
              $('[ng-view]').append('<div class="bmm-loading">Laster...</div>');

              bmmApi.trackLatest({
                from: size,
                tags: ['mp3-kilden'],
                size: loadAmount
              }, bmmUser.mediaLanguage).done(function(data) {

                $('.bmm-loading').remove();
                resolveTracks(data, size);
                size+=loadAmount;

              });

            }

          });

          bmmApi.trackLatest({
            size: loadAmount,
            tags: ['mp3-kilden']
          }, bmmUser.mediaLanguage).done(function(data) {

            resolveTracks(data);
            size+=loadAmount;

          });

          $timeout(function() {
            $scope.podcast.isset = true;
            $scope.podcast.link = 'https://'+bmmUser.getUser().username+':'+
                                  bmmUser.getUser().token+'@'+
                                  bmmApi.getserverUrli().replace('https://','')+
                                  'podcast/track/?tags[]=mp3-kilden&language='+
                                  bmmUser.mediaLanguage;
            $scope.podcast.itunes = 'itpc://'+bmmUser.getUser().username+':'+
                                  bmmUser.getUser().token+'@'+
                                  bmmApi.getserverUrli().replace('https://','')+
                                  'podcast/track/?tags[]=mp3-kilden&language='+
                                  bmmUser.mediaLanguage;
          },1500);

          break;
        case 'barnasmp3':

          size = 0;
          $scope.title = 'Barnas mp3';
          $(window).on('scrollBottom', function() {

            if (!loading&&!end) {
              loading = true;
              $('[ng-view]').append('<div class="bmm-loading">Laster...</div>');

              bmmApi.trackLatest({
                from: size,
                tags: ['child-favorites'],
                size: loadAmount
              }, bmmUser.mediaLanguage).done(function(data) {

                $('.bmm-loading').remove();
                resolveTracks(data, size);
                size+=loadAmount;

              });

            }

          });

          bmmApi.trackLatest({
            size: loadAmount,
            tags: ['child-favorites']
          }, bmmUser.mediaLanguage).done(function(data) {

            resolveTracks(data);
            size+=loadAmount;

          });

          $timeout(function() {
            $scope.podcast.isset = true;
            $scope.podcast.link = 'https://'+bmmUser.getUser().username+':'+
                                  bmmUser.getUser().token+'@'+
                                  bmmApi.getserverUrli().replace('https://','')+
                                  'podcast/track/?tags[]=child-favorites&language='+
                                  bmmUser.mediaLanguage;
            $scope.podcast.itunes = 'itpc://'+bmmUser.getUser().username+':'+
                                  bmmUser.getUser().token+'@'+
                                  bmmApi.getserverUrli().replace('https://','')+
                                  'podcast/track/?tags[]=child-favorites&language='+
                                  bmmUser.mediaLanguage;
          },1500);

          break;
        case 'instrumental':

          size = 0;
          $scope.title = 'Instrumental';
          $(window).on('scrollBottom', function() {

            if (!loading&&!end) {
              loading = true;
              $('[ng-view]').append('<div class="bmm-loading">Laster...</div>');

              bmmApi.trackLatest({
                from: size,
                tags: ['instrumental'],
                size: loadAmount
              }, bmmUser.mediaLanguage).done(function(data) {

                $('.bmm-loading').remove();
                resolveTracks(data, size);
                size+=loadAmount;

              });

            }

          });

          bmmApi.trackLatest({
            size: loadAmount,
            tags: ['instrumental']
          }, bmmUser.mediaLanguage).done(function(data) {

            resolveTracks(data);
            size+=loadAmount;

          });

          $timeout(function() {
            $scope.podcast.isset = true;
            $scope.podcast.link = 'https://'+bmmUser.getUser().username+':'+
                                  bmmUser.getUser().token+'@'+
                                  bmmApi.getserverUrli().replace('https://','')+
                                  'podcast/track/?tags[]=instrumental&language='+
                                  bmmUser.mediaLanguage;
            $scope.podcast.itunes = 'itpc://'+bmmUser.getUser().username+':'+
                                  bmmUser.getUser().token+'@'+
                                  bmmApi.getserverUrli().replace('https://','')+
                                  'podcast/track/?tags[]=instrumental&language='+
                                  bmmUser.mediaLanguage;
          },1500);

          break;
        case 'contributor':

          size = 0;
          $scope.title = $routeParams.id;
          $(window).on('scrollBottom', function() {

            if (!loading&&!end) {
              loading = true;
              $('[ng-view]').append('<div class="bmm-loading">Laster...</div>');

              bmmApi.contributorTracksGet($routeParams.id, {
                from: size,
                size: loadAmount
              }, bmmUser.mediaLanguage).done(function(data) {

                $('.bmm-loading').remove();
                resolveTracks(data, size);
                size+=loadAmount;

              });

            }

          });

          bmmApi.contributorTracksGet($routeParams.id, {
            size: loadAmount
          }, bmmUser.mediaLanguage).done(function(data) {

            resolveTracks(data);
            size+=loadAmount;

          });

          if ($routeParams.id==='Kåre J. Smith') {
            $timeout(function() {
              $scope.podcast.isset = true;
              $scope.podcast.link = 'https://'+bmmUser.getUser().username+':'+
                                    bmmUser.getUser().token+'@'+
                                    bmmApi.getserverUrli().replace('https://','')+
                                    'podcast/contributor/K%C3%A5re%20J.%20Smith/track/?language='+
                                    bmmUser.mediaLanguage;
              $scope.podcast.itunes = 'itpc://'+bmmUser.getUser().username+':'+
                                    bmmUser.getUser().token+'@'+
                                    bmmApi.getserverUrli().replace('https://','')+
                                    'podcast/contributor/K%C3%A5re%20J.%20Smith/track/?language='+
                                    bmmUser.mediaLanguage;
            },1500);
          }

          break;
      }

      var resolveTracks = function(data, startindex) {

        if (typeof startindex==='undefined') {
          startindex = 0;
        }

        var track, cnt=0;

        $.each(data, function(index) {

          track = bmmFormatterTrack.resolve(this);

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

        });

        $scope.$apply(function() {
          $timeout(function() {
            $('.bmm-playlist').trigger('dragdrop');
            loading = false;
          });
        });

        findPlayingTrack();
        if (cnt<loadAmount) { end = true; }

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

        bmmApi.userTrackCollectionPut($routeParams.id ,{
          type: 'track_collection',
          track_references: playlist,
          access: [bmmUser.getUsername()],
          name: $scope.title
        });

      };

      var findPlayingTrack = function() {
        if ($location.path()===bmmPlaylist.getUrl()) {

          $.each($scope.playlist, function(index) {
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

    };

  });