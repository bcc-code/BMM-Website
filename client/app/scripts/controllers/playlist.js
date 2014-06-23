'use strict';

angular.module('bmmApp')
  .controller('PlaylistCtrl', function (
    $scope,
    $routeParams,
    $timeout,
    $location,
    $window,
    bmmApi,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    init,
    bmmPlay,
    bmmPlayer,
    bmmPlaylist
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
            $('[ng-view]').append('<div class="bmm-loading">'+init.translation.general.loading+'</div>');

            bmmApi.search($routeParams.id, {
              from: size,
              size: loadAmount
            }, init.mediaLanguage).done(function(data) {

              $('.bmm-loading').remove();
              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        bmmApi.search($routeParams.id, {
          size: loadAmount
        }, init.mediaLanguage).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        break;
      case 'latest':

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/playlist/latest',
          'title': 'Latest tracks'
        });

        $scope.title = init.translation.playlist.latestTracks;
        size = 0;

        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {

            loading = true;
            $('[ng-view]').append('<div class="bmm-loading">'+init.translation.general.loading+'</div>');

            bmmApi.trackLatest({
              from: size,
              size: loadAmount
            }, init.mediaLanguage).done(function(data) {

              $('.bmm-loading').remove();
              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        bmmApi.trackLatest({
          size: loadAmount
        }, init.mediaLanguage).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        break;
      case 'private':

        $scope.zip.url = bmmApi.secureDownload(bmmApi.getserverUrli()+'track_collection'+'/'+$routeParams.id+'/download');
        $scope.zip.show = true;
        $scope.private = true;
        bmmApi.userTrackCollectionGet($routeParams.id).done(function(data) {

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

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/playlist/mp3kilden',
          'title': 'Mp3-Kilden'
        });

        size = 0;
        $scope.title = init.translation.page.music.mp3Source;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $('[ng-view]').append('<div class="bmm-loading">'+init.translation.general.loading+'</div>');

            bmmApi.trackLatest({
              from: size,
              tags: ['mp3-kilden'],
              size: loadAmount
            }, init.mediaLanguage).done(function(data) {

              $('.bmm-loading').remove();
              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        bmmApi.trackLatest({
          size: loadAmount,
          tags: ['mp3-kilden']
        }, init.mediaLanguage).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        $timeout(function() {
          $scope.podcast.link = 'https://'+init.user.username+':'+
                                init.user.token+'@'+
                                bmmApi.getserverUrli().replace('https://','')+
                                'podcast/track/?tags[]=mp3-kilden&';
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
        $scope.title = init.translation.page.music.childrensMp3Source;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $('[ng-view]').append('<div class="bmm-loading">'+init.translation.general.loading+'</div>');

            bmmApi.trackLatest({
              from: size,
              tags: ['child-favorites'],
              size: loadAmount
            }, init.mediaLanguage).done(function(data) {

              $('.bmm-loading').remove();
              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        bmmApi.trackLatest({
          size: loadAmount,
          tags: ['child-favorites']
        }, init.mediaLanguage).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        $timeout(function() {
          $scope.podcast.link = 'https://'+init.user.username+':'+
                                init.user.token+'@'+
                                bmmApi.getserverUrli().replace('https://','')+
                                'podcast/track/?tags[]=child-favorites&';
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
        $scope.title = init.translation.playlist.instrumental;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $('[ng-view]').append('<div class="bmm-loading">'+init.translation.general.loading+'</div>');

            bmmApi.trackLatest({
              from: size,
              tags: ['instrumental'],
              size: loadAmount
            }, init.mediaLanguage).done(function(data) {

              $('.bmm-loading').remove();
              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        bmmApi.trackLatest({
          size: loadAmount,
          tags: ['instrumental']
        }, init.mediaLanguage).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        $timeout(function() {
          $scope.podcast.link = 'https://'+init.user.username+':'+
                                init.user.token+'@'+
                                bmmApi.getserverUrli().replace('https://','')+
                                'podcast/track/?tags[]=instrumental&';
          $scope.showPodcast = true;
        },1500);

        break;
      case 'contributor':

        // @analytics - Report page view to google analytics
        $window.ga('send', 'pageview', {
          'page': '/playlist/contributor/'+$routeParams.name,
          'title': $routeParams.name
        });

        size = 0;
        $scope.title = $routeParams.name;
        $(window).on('scrollBottom', function() {

          if (!loading&&!end) {
            loading = true;
            $('[ng-view]').append('<div class="bmm-loading">'+init.translation.general.loading+'</div>');

            bmmApi.contributorTracksGet($routeParams.id, {
              from: size,
              size: loadAmount
            }, init.mediaLanguage).done(function(data) {

              $('.bmm-loading').remove();
              resolveTracks(data);
              size+=loadAmount;

            });

          }

        });

        bmmApi.contributorTracksGet($routeParams.id, {
          size: loadAmount
        }, init.mediaLanguage).done(function(data) {

          resolveTracks(data);
          size+=loadAmount;

        });

        $timeout(function() {
          $scope.podcast.link = 'https://'+init.user.username+':'+
                                init.user.token+'@'+
                                bmmApi.getserverUrli().replace('https://','')+
                                'podcast/contributor/'+$routeParams.id+'/track/?';
          $scope.showPodcast = true;
        },1500);

        break;
    }

    var resolveTracks = function(data) {

      var track, cnt=0;

      $.each(data, function(index) {

        if (this.type==='album') {
          $scope.albums.push(bmmFormatterAlbum.resolve(this));
          $scope.albumCount++;
          cnt++;
        } else {

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

        }

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
        access: [init.user.username],
        name: $scope.title
      });

    };

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
