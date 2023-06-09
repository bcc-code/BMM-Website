'use strict';

angular.module('bmmApp')
  .controller('AlbumCtrl', function (
    $scope,
    $filter,
    $location,
    $routeParams,
    $timeout,
    _api,
    _session,
    _init,
    _album,
    _track,
    _quickMenu
  ) {

    var modelLoaded=false, newAlbum=false;

    if ($routeParams.id==='new') {
      newAlbum = true;
    }

    $scope.model = {}; //Raw
    $scope.standardModel = {}; //Standard
    $scope.hasChildAlbums = false;

    $scope.fetchModel = function(_raw) {
      if (!newAlbum) {
        if (typeof _raw==='undefined'||_raw) {
          return _api.albumGet($routeParams.id, { raw: true });
        } else {
          return _api.albumGet($routeParams.id, {
            unpublished: 'show'
          });
        }
      } else {

        if (typeof $routeParams.parentId==='undefined') {
          $routeParams.parentId = null;
        }

        if (typeof $routeParams.language==='undefined') {
          $routeParams.language = _session.current.contentLanguages[0];
        }

        if (typeof $routeParams.date==='undefined') {
          $routeParams.date = new Date();
        }

        var languages = [];
        if (typeof $routeParams.languages==='undefined') {
          languages = [{language: $routeParams.language}];
        } else {
          $.each($routeParams.languages.split(','), function() {
            languages.push({language: this});
          });
        }

        $scope.model = {
          parent_id: $routeParams.parentId,
          type: 'album',
          published_at: $routeParams.date,
          original_language: $routeParams.language,
          translations: languages,
          tags: [],
          cover: null,
          cover_upload: null
        };
        return;
      }
    };

    var findAvailableTranslations = function() {
      $scope.availableLanguages = [];
      _api.root().done(function(root) {
        $scope.$apply(function() {
          $.each(root.languages, function() {
            var available = this, found=false;
            $.each($scope.model.translations, function() {
              if (this.language===available) {
                found = true;
              }
            });
            if (!found) {
              $scope.availableLanguages.push(available);
            }
          });
          if (typeof $scope.edited==='undefined') {
            $scope.switchLanguage($scope.model.original_language);
          } else {
            $scope.switchLanguage($scope.edited.language);
          }
        });
      });
    };

    var findAvailableTags = function() {

      $scope.availableTags = [];
      $.each(_init.titles.album, function(key) {
        var available = key, found=false;
        $.each($scope.model.tags, function() {
          if (this===available) {
            found = true;
          }
        });
        if (!found) {
          $scope.availableTags.push(available);
        }
      });
      $scope.availableTags.push("Audiobook"); //We want to have Audiobook as a possible tag without translating it.
    };

    $scope.refreshModel = function() {
      try {
        $scope.fetchModel().done(function(model) {
          $scope.$apply(function() {
            $scope.model = model;
            findAvailableTranslations();
            findAvailableTags();
            _quickMenu.setMenu($scope.model.published_at.substring(0,4), $scope.model.parent_id, $scope.model.id);
          });
          modelLoaded = true;
          $scope.status = _init.translation.states.noChanges;
        });
        $scope.fetchModel(false).done(function(model) {
          $scope.$apply(function() {

            if (typeof $routeParams.add!=='undefined'&&$routeParams.add==='track') {

              $location.path('/track/new/'+model.id+'/'+(model.children.length+1)+'/'+model.language+'/'+model.languages+'/'+model.published_at);

            } else if (typeof $routeParams.add!=='undefined'&&$routeParams.add==='album') {

              $location.path('/album/new/'+model.id+'/'+model.language+'/'+model.languages+'/'+model.published_at);

            } else {

              $scope.standardModel = model;
              if (typeof model.children!=='undefined') {
                $scope.hasChildAlbums = false;
                $scope.tracks = [];
                $.each(model.children, function() {
                  if (this.type==='album') {
                    $scope.hasChildAlbums = true;
                  } else {
                    $scope.tracks.push(_track.resolve(this));
                  }
                });
              }

            }
          });
        });
      }
      catch(err) {
        //Model is not yet created, fires when routeParams.id === 'new'
        $timeout(function() {
          findAvailableTranslations();
          findAvailableTags();
        });
      }
    };
    $scope.refreshModel();

    var saveModel = function() {
      //Delete parts that's unexpected by the api
      var toApi = angular.copy($scope.model);
      delete toApi._meta;
      delete toApi.id;
      delete toApi.show_in_listing;

      $.each(toApi.translations, function() {
        delete this._meta;
      });

      if (newAlbum) {
        _api.albumPost(toApi).done(function(data, st, xhr, config) {
          if (xhr.status===201) {
            $location.path('/album/'+xhr.getResponseHeader('X-Document-Id'));
          } else {
            $scope.status = _init.translation.states.couldNotCreateAlbum+', '+
                            _init.translation.states.errorCode+': '+xhr.status;
          }
        });
      } else {
        return _api.albumPut($routeParams.id, toApi);
      }
    };

    $scope.save = function(options) {
      $scope.status = _init.translation.states.attemptToSave;
      try {
        saveModel().done(function() {
          $scope.status = _init.translation.states.saveSucceedFetchingNewData;
          $scope.$apply();
          $scope.fetchModel().done(function(model) {
            $scope.$apply(); //Model-watcher updates status to changed
            $scope.model = model;
            findAvailableTranslations();
            findAvailableTags();
            $timeout(function() { //Secure that watcher is fired
              $scope.status = _init.translation.states.saved; //Update status
              $scope.$apply(); //Render status
            });
            $scope.$apply(function() {
              $scope.status = 'Saved';
              if (typeof options!=='undefined'&&typeof options.done!=='undefined') {
                options.done();
              }
              _quickMenu.setMenu($scope.model.published_at.substring(0,4), $scope.model.parent_id, $scope.model.id);
            });
          }).fail(function() {
            $scope.status = _init.translation.states.couldNotFetchData;
            $scope.$apply();
          });
          $scope.fetchModel(false).done(function(model) {
            $scope.$apply(function() {
              $scope.standardModel = model;
              _quickMenu.refresh();
            });
            if (typeof model.children!=='undefined') {
              $scope.hasChildAlbums = false;
              $.each(model.children, function() {
                if (this.type==='album') {
                  $scope.$apply(function() {
                    $scope.hasChildAlbums = true;
                  });
                  return false;
                }
              });
            }
          });
        }).fail(function() {
          $scope.status = _init.translation.states.couldNotSave;
          $scope.$apply();
        });
      }
      catch(err) {
        //Model is not yet created, fires when routeParams.id === 'new'
      }
    };

    $scope.delete = function() {
      if (typeof $scope.model.id!=='undefined') {
        if (confirm(_init.translation.warnings.confirmAlbumDeletion)) {
          _api.albumDelete($scope.model.id).always(function() {
            $scope.$apply(function() {
              alert('Album deleted');
              _quickMenu.refresh();
              $location.path( '/' );
            });
          });
        }
      }
    };

    $scope.addLanguage = function(lang) {
      $scope.model.translations.push({
        is_visible: false,
        language: lang,
        title: ''
      });
      $.each($scope.availableLanguages, function(index) {
        if (this === lang) {
          $scope.availableLanguages.splice(index,1);
          return false;
        }
      });
    };

    $scope.removeLanguage = function(lang) {
      if ($scope.edited.language===lang) {
        $scope.switchLanguage($scope.model.original_language);
      }
      $.each($scope.model.translations, function(index) {
        if (this.language === lang) {
          if (((typeof this.title!=='undefined'&&this.title.length>0)||
              (typeof this.description!=='undefined'&&this.description.length>0))&&
              !confirm(_init.translation.warnings.confirmTranslatedDeletion)) {
            return false;
          }
          $scope.model.translations.splice(index,1);
          $scope.availableLanguages.push(lang);
          return false;
        }
      });
    };

    $scope.switchLanguage = function(newLang, oldLang) {
      if (typeof oldLang!=='undefined') {
        $.each($scope.model.translations, function(index) {
          if (this.language===oldLang) {
            $scope.model.translations[index] = $scope.edited;
            return false;
          }
        });
      }
      $.each($scope.model.translations, function() {
        if (this.language===newLang) {
          $scope.edited = this;
          return false;
        }
      });
    };

    $scope.$watch('edited', function(newEdit, oldEdit) {
      if (typeof newEdit!=='undefined'&&(newEdit.title===''||
        typeof newEdit.title==='undefined')) {
        newEdit.is_visible = false;
        //Inform why change cant be done when trying to publish
        if (typeof oldEdit!=='undefined'&&
          newEdit.is_visible===oldEdit.is_visible&&
          newEdit.language===oldEdit.language&&
          newEdit.title===oldEdit.title) {
          alert(_init.translation.page.editor.missingTitle);
        }
      }
    }, true);

    $scope.$watch('model', function(model) {
      if (modelLoaded) {
        $scope.status = _init.translation.states.changesPerformed;
      }

      if (typeof model.parent_id!=='undefined'&&model.parent_id!==null) {
        _api.albumGet(model.parent_id,{
          unpublished: 'show'
        }).done(function(album) {
          $scope.$apply(function() {
            $scope.albumParentYear = parseInt(album.published_at.substring(0,4),10);
            if (typeof $scope.parentAlbums==='undefined'||$scope.parentAlbums.length<=0) {
              $scope.findParentAlbums($scope.albumParentYear, album);
            }
          });
        });
      }

    }, true);

    $scope.$watch('model.original_language', function(lang) {
      if (typeof $scope.model.translations!=='undefined') {
        $.each($scope.model.translations, function() {
          if (this.language===lang) {
            $scope.originalLanguage = this;
            return false;
          }
        });
      }
    });

    $scope.addTag = function(tag) {
      $.each($scope.availableTags, function(index) {
        if (this===tag) {
          $scope.availableTags.splice(index,1);
          return false;
        }
      });
      $scope.model.tags.push(tag);
    };

    $scope.removeTag = function(tag) {
      $.each($scope.model.tags, function(index) {
        if (this===tag) {
          $scope.model.tags.splice(index,1);
          return false;
        }
      });
      $scope.availableTags.push(tag);
    };

    $scope.generateTitles = function() {

      var translation = _init.titles.album;

      $.each($scope.model.tags, function() {
        var tag = this;
        if (typeof translation[tag]!=='undefined') {
          $.each($scope.model.translations, function() {

            if (typeof translation[tag][this.language]!=='undefined') {
              this.title = translation[tag][this.language];

              if (tag==='Meeting') {
                this.title+=' '+$filter('_locals')($scope.model.published_at, this.language);
              } else {
                this.title+=' '+$filter('date')($scope.model.published_at,'yyyy');
              }
              this.is_visible = true;
            }

          });
        }

      });

    };

    $scope.uploadCover = {
      url: _api.getserverUrli()+'album/'+$routeParams.id+'/cover',
      method: 'PUT'
    };

    //FETCH ALBUMS
    $scope.parentAlbums = [];
    $scope.findParentAlbums = function(year, _album_) {

      _api.albumPublishedYear(year, {
        unpublished: 'show'
      }, _init.contentLanguage).done(function(albums) {

        $scope.$apply(function() {
          $.each(albums, function() {
            var album = _album.resolve(this);
            $scope.parentAlbums.push(album);
          });

          $scope.parentAlbums.push({
            title: '['+_init.translation.page.editor.noParentAlbum+']',
            id: null
          });
          $scope.parentAlbums.reverse();
          if (typeof _album_!=='undefined') {
            $.each($scope.parentAlbums, function(index) {
              if (this.id===_album_.id) {
                $scope.parentAlbum = $scope.parentAlbums[index];
                $scope.parentAlbumCurrent = this.title;
                return false;
              }
            });
          }
        });

      });
    };

    $scope.selectParentAlbum = function(album) {
      $scope.model.parent_id = album.id;
      $scope.parentAlbumCurrent = album.title;
    };

  });
