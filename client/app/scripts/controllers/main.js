'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $timeout,
    $location,
    $route,
    $window,
    init,
    bmmApi,
    bmmPlaylist,
    bmmPlay,
    bmmPlayer,
    draggable
  ) {

    $scope.load = init.load;

    init.load.complete.promise.then(function() {

      $('.bmm-view').off('scrollBottom');

      $scope.user = init.user;
      $scope.root = init.root;
      $scope.translation = init.translation;
      $scope.translations = init.translations;
      $scope.podcastLanguage = $scope.websiteLanguage = $scope.mediaLanguage = init.mediaLanguage;
      $scope.ios = init.ios;
      $scope.now = new Date();

      $scope.saveSession = function() {
        sessionStorage[init.user.username] = angular.toJson({
          mediaLanguage: $scope.mediaLanguage,
          websiteLanguage: $scope.websiteLanguage,
          videoFirst: bmmPlayer.videoFirst
        });
      };

      $scope.pushMessages = [
        { title: 'Test push message', message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et leo turpis. Ut dapibus elit ac orci tincidunt placerat. Nullam id congue risus.'},
        { title: 'En annen push message', message: 'Aliquam iaculis purus nec diam laoreet, vitae ultricies felis facilisis.'},
        { title: 'Osv..', message: 'Donec massa ligula, malesuada id sapien at, pharetra bibendum velit. Nunc condimentum quis turpis nec rutrum.'}
      ];

      $scope.removePushMessage = function(index) {
        $scope.pushMessages.splice(index,1);
      };

      $scope.restoreSession = function() {
        var model = angular.fromJson(sessionStorage[init.user.username]);
        if (typeof model!=='undefined') {
          bmmPlayer.videoFirst = model.videoFirst;
          $scope.mediaLanguage = init.mediaLanguage = model.mediaLanguage;
          if (init.translations[model.websiteLanguage]!=='undefined') {
            $scope.websiteLanguage = init.websiteLanguage = model.websiteLanguage;
            $scope.translation = init.translation = init.translations[model.websiteLanguage];
          }
        }
      };
      $scope.restoreSession();

      $scope.$parent.$watch('mediaLanguage', function(lang) {
        if (typeof mediaLanguage!=='undefined') {
          $scope.podcastLanguage = lang;
        }
      });

      $scope.getCurrent = function() {
        $location.path( bmmPlaylist.getUrl() );
      };

      $scope.setMediaLanguage = function(lang) {
        $scope.mediaLanguage = init.originalLanguage = init.mediaLanguage = lang;
        $scope.saveSession();
        $route.reload();
      };

      $scope.setWebsiteLanguage = function(lang) {
        $scope.websiteLanguage = lang;
        $scope.translation = init.translation = init.translations[lang];
        $scope.saveSession();
      };

      $scope.go = function ( path ) {
        $location.path( path );
      };

      $scope.play = function(playlist, index, timestamp, verse) {

        if (typeof verse!=='undefined') {
          $window.ga('send', 'event', 'bible verse', 'play', verse);
        }

        bmmPlay.setPlay(playlist, index, true, timestamp);
      };

      //Deprecated
      $scope.addToPlaylist = function(playlistId, trackId, language) {
        bmmApi.userTrackCollectionLink(playlistId, [
          trackId
        ], language);
      };

      $scope.addTracksToPlaylist = function(playlistId, tracks) {
        var ids = [];
        $.each(tracks, function() {
          ids.push(this.id);
        });
        bmmApi.userTrackCollectionLink(playlistId, ids, init.mediaLanguage);
      };

      $scope.addPLaylist = function(newPlaylist) {

        bmmApi.userTrackCollectionPost({
          name: newPlaylist,
          type: 'track_collection',
          access: [init.user.username]
        }).always(function(xhr) {

          if (xhr.status===201) {

            $scope.$apply(function() {

              $scope.bmmPlaylistAdd = false;
              $scope.newPlaylist = '';
              $scope.user.track_collections.splice(0,0, {
                id: xhr.getResponseHeader('X-Document-Id'),
                name: newPlaylist
              });

              $timeout(function() {
                $scope.$apply(function() {
                  //For playlists
                  $('.bmm-playlist').trigger('dragdrop');
                  //Other draggables
                  draggable.makeDraggable($scope);
                });
              });

            });
          }

        });

      };

      $scope.removePLaylist = function(playlist) {
        if (confirm(init.translation.playlist.confirmPlaylistDeletion)) {
          bmmApi.userTrackCollectionDelete(playlist).fail(function(xhr) {
            if (xhr.status<300) {
              $.each($scope.user.track_collections, function(index) {
                if (this.id===playlist) {
                  $scope.$apply(function() {
                    $scope.user.track_collections.splice(index,1);
                  });
                  return false;
                }
              });
            }
          });
        }
      };

      $scope.renamePlaylist = function(_collection) {

        bmmApi.userTrackCollectionGet(_collection.id).done(function(collection) {

          var makeReferences = function(tracks) {
            var ref=[];
            $.each(tracks, function() {
              ref.push({
                id: this.id,
                language: this.language
              });
            });
            return ref;
          };

          bmmApi.userTrackCollectionPut(_collection.id, {
            name: _collection.newName,
            type: 'track_collection',
            track_references: makeReferences(collection.tracks),
            access: collection.access
          }).always(function() {

            $scope.$apply(function() {
              _collection.edit = false;
              _collection.name = _collection.newName;
            });

          });

        });

      };

      $scope.exitRename = function(_collection) {
        _collection.edit = false;
      };

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