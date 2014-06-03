'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $timeout,
    $location,
    $route,
    init,
    bmmApi,
    bmmPlaylist,
    bmmPlay,
    draggable
  ) {

    $scope.load = init.load;

    init.load.complete.promise.then(function() {

      $('.bmm-view').off('scrollBottom');

      $scope.user = init.user;
      $scope.root = init.root;
      $scope.translation = init.translation;
      $scope.mediaLanguage = init.mediaLanguage;
      $scope.ios = init.ios;

      $scope.getCurrent = function() {
        $location.path( bmmPlaylist.getUrl() );
      };

      $scope.setMediaLanguage = function(lang) {
        init.mediaLanguage = lang;
        $scope.mediaLanguage = lang;
        init.originalLanguage = lang;
        $route.reload();
      };

      $scope.go = function ( path ) {
        $location.path( path );
      };

      $scope.play = function(playlist, index) {
        bmmPlay.setPlay(playlist, index);
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
              _collection.newName = '';
            });

          });

        });

      };

      $scope.exitRename = function(_collection) {
        _collection.newName = '';
        _collection.edit = false;
      };

      $(window).bind('scroll', function() {
        if($(window).scrollTop() + $(window).height()>=$(document).height()) {
          $(window).trigger('scrollBottom');
        }
      });
    });

  });