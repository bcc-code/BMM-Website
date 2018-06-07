'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $rootScope,
    $timeout,
    $location,
    $route,
    $window,
    _init,
    _api,
    _playlist,
    _play,
    _player,
    _draggable
  ) {

    $scope.load = _init.load;

    _init.load.complete.promise.then(function() {

      $rootScope.init = $scope.init = _init;
      $scope.now = function() { return new Date(); };

      $scope.pushMessages = [];

      $scope.removePushMessage = function(index) {
        $scope.pushMessages.splice(index,1);
        $scope.saveSession();
      };

      $scope.saveSession = function() {
        localStorage[_init.user.username] = angular.toJson({
          contentLanguages: $scope.init.contentLanguages,
          websiteLanguage: $scope.init.websiteLanguage,
          videoFirst: _player.videoFirst,
          pushMessages: $scope.pushMessages
        });
      };

      $scope.restoreSession = function() {
        var model = angular.fromJson(localStorage[_init.user.username]);
        if (typeof model!=='undefined') {
          if (typeof model.pushMessages!=='undefined') {
            $scope.pushMessages = model.pushMessages;
          }
          _player.videoFirst = model.videoFirst;

          //This is just so that users that still only have 1 language in their
          //localStorage, prepend their language to the contentLanguages.
          if(model.contentLanguage) {
            _init.prependLanguage(model.contentLanguage);
            delete model.contentLanguage;
          }

          if(model.contentLanguages) {
            _api.setContentLanguages(model.contentLanguages);
            $scope.init.contentLanguages = _init.contentLanguages = model.contentLanguages;
          }

          if (typeof _init.translations[model.websiteLanguage]!=='undefined') {
            $scope.init.websiteLanguage = _init.websiteLanguage = model.websiteLanguage;
            $scope.init.translation = _init.translation = _init.translations[model.websiteLanguage];
          }
        }
      };
      $scope.restoreSession();

      $scope.$parent.$watch('init.contentLanguages[0]', function(lang) {
        if (typeof lang!=='undefined') {
          $scope.init.podcastLanguage = lang;
        }
      });

      _api.podcastsGet().then(function(podcasts) {
        $scope.podcasts = podcasts;
      });

      $scope.getCurrent = function() {
        $location.path( _playlist.getUrl() );
      };

      $scope.closeLanguageSettingsPopup = function()
      {
        $scope.settings.show=false;
        $scope.setContentLangConditional();
      };

      $scope.removeContentLanguage = function(index) {
        $scope.init.contentLanguages.splice(index, 1);
        $scope.setLanguagesChanged();
      };

      $scope.updateContentLanguage = function(lang, language) {
        $scope.init.contentLanguages[$scope.init.contentLanguages.indexOf(language)] = lang;
        $scope.setLanguagesChanged();
      };

      $scope.setLanguagesChanged = function() {
        $scope.contentLangsChanged = true;
      };

      $scope.sortableOptions = {
        handle: '.sort_handle',
        update: function() {
          $scope.setLanguagesChanged();
        },
        axis: 'y' 
      };

      //This filter functions filters out the languages
      //that are already selected. Prevents duplicates.
      $scope.exceptSelected = function(item) {
        return $scope.init.contentLanguages.indexOf(item) === -1;
      };

      $scope.addLanguage = function() {
        var langs = $scope.init.root.languages;
        for(var i = 0; i < langs.length; i++) {
          var lang = langs[i];
          if($scope.exceptSelected(lang)) {
            _init.appendLanguage(lang);
            return;
          }
        }
      };

      $scope.setContentLangConditional = function() {
        if($scope.contentLangsChanged) {
          $scope.setContentLanguages($scope.init.contentLanguages);
          $scope.contentLangsChanged = false;
        }
      };

      $scope.setContentLanguages = function() {
        //The first language is the 'primary' content language
        $scope.saveSession();
        $route.reload();
      };

      $scope.setWebsiteLanguage = function(lang) {
        $scope.init.websiteLanguage = lang;
        $scope.init.translation = _init.translation = _init.translations[lang];
        $scope.saveSession();
      };

      $rootScope.go = $scope.go = function ( path ) {
        $location.path( path );
      };

      //deprecated - to be removed.
      //
      //use _play.setPlay directly instead
      $scope.play = function(playlist, index, timestamp, verse) {
        _play.setPlay(playlist, index, true, timestamp, verse);
      };

      //Deprecated
      $scope.addToPlaylist = function(playlistId, trackId, language) {
        _api.userTrackCollectionLink(playlistId, [
          trackId
        ], language);
      };

      $scope.addTracksToPlaylist = function(playlistId, tracks, language) {
        var ids = [];
        var lang = language;
        $.each(tracks, function() {
          ids.push(this.id);
          if(lang != this.language){ // if there are more languages in a playlist/album
            lang = undefined; // we want all tracks, not just from one language
          }
        });
        _api.userTrackCollectionLink(playlistId, ids, lang);
      };

      $scope.addPLaylist = function(newPlaylist) {

        _api.userTrackCollectionPost({
          name: newPlaylist,
          type: 'track_collection',
          access: [_init.user.username]
        }).done(function(data, st, xhr, config) {

          if (xhr.status===201) {
            $scope._playlistAdd = false;
            $scope.newPlaylist = '';
            $scope.init.user.track_collections.splice(0,0, {
              id: xhr.getResponseHeader('X-Document-Id'),
              name: newPlaylist
            });
          }

        });

      };

      $scope.removePLaylist = function(playlist) {
        if (confirm(_init.translation.playlist.confirmPlaylistDeletion)) {
          _api.userTrackCollectionDelete(playlist).done(function(data, st, xhr, config) {
            if (xhr.status<300) {
              $.each($scope.init.user.track_collections, function(index) {
                if (this.id===playlist) {
                  $scope.init.user.track_collections.splice(index,1);
                  return false;
                }
              });
            }
          });
        }
      };

      $scope.renamePlaylist = function(_collection) {

        _collection.edit = false;
        _collection.name = _collection.newName;

        _api.userTrackCollectionGet(_collection.id).done(function(collection) {

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

          _api.userTrackCollectionPut(_collection.id, {
            name: _collection.newName,
            type: 'track_collection',
            track_references: makeReferences(collection.tracks),
            access: collection.access
          });

        });

      };

      $scope.exitRename = function(_collection) {
        _collection.edit = false;
      };

      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

      $('.bmm-view').off('scrollBottom');
      $(window).bind('scroll', function() {
        if($(window).scrollTop() + $(window).height()>=$(document).height()) {
          $(window).trigger('scrollBottom');
        }
      });

    });

  });