'use strict';

angular.module('bmmApp')
  .controller('AlbumCtrl', function (
    $scope,
    $filter,
    $location,
    $rootScope,
    $routeParams,
    $timeout,
    bmmApi,
    init,
    bmmFormatterAlbum,
    bmmFormatterTrack,
    quickMenu
  ) {

    var modelLoaded=false, newAlbum=false;

    if ($routeParams.id==='new') {
      newAlbum = true;
    }

    $scope.model = {}; //Raw
    $scope.standardModel = {}; //Standard
    $scope.hasChildAlbums = false;
    $scope.status = init.translation.states.noChanges;

    $scope.fetchModel = function(_raw) {
      if (!newAlbum) {
        if (typeof _raw==='undefined'||_raw) {
          return bmmApi.albumGet($routeParams.id, '', { raw: true });
        } else {
          return bmmApi.albumGet($routeParams.id, init.mediaLanguage, {
            unpublished: 'show'
          });
        }
      } else {

        if (typeof $routeParams.parentId==='undefined') {
          $routeParams.parentId = null;
        }

        if (typeof $routeParams.language==='undefined') {
          $routeParams.language = init.mediaLanguage;
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

    $scope.refreshModel = function() {
      try {
        $scope.fetchModel().done(function(model) {
          $scope.$apply(function() {
            $scope.model = model;
            findAvailableTranslations();
            findAvailableTags();
            quickMenu.setMenu($scope.model.published_at.substring(0,4), $scope.model.parent_id, $scope.model.id);
          });
          modelLoaded = true;
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
                    $scope.tracks.push(bmmFormatterTrack.resolve(this));
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
      //Delete parts that's unexpected by the API
      var toApi = angular.copy($scope.model);
      delete toApi._meta;
      delete toApi.id;
      delete toApi.show_in_listing;
      if (newAlbum) {
        bmmApi.albumPost(toApi).always(function(xhr) {
          if (xhr.status===201) {
            $location.path('/album/'+xhr.getResponseHeader('X-Document-Id'));
          } else {
            $scope.status = init.translation.states.couldNotCreateAlbum+', '+
                            init.translation.states.errorCode+': '+xhr.status;
          }
        });
      } else {
        return bmmApi.albumPut($routeParams.id, toApi);
      }
    };

    $scope.save = function(options) {
      $scope.status = init.translation.states.attemptToSave;
      try {
        saveModel().done(function() {
          $scope.status = init.translation.states.saveSucceedFetchingNewData;
          $scope.$apply();
          $scope.fetchModel().done(function(model) {
            $scope.$apply(); //Model-watcher updates status to changed
            $scope.model = model;
            findAvailableTranslations();
            findAvailableTags();
            $timeout(function() { //Secure that watcher is fired
              $scope.status = init.translation.states.saved; //Update status
              $scope.$apply(); //Render status
            });
            $scope.$apply(function() {
              $scope.status = 'Saved';
              if (typeof options!=='undefined'&&typeof options.done!=='undefined') {
                options.done();
              }
              quickMenu.setMenu($scope.model.published_at.substring(0,4), $scope.model.parent_id, $scope.model.id);
            });
          }).fail(function() {
            $scope.status = init.translation.states.couldNotFetchData;
            $scope.$apply();
          });
          $scope.fetchModel(false).done(function(model) {
            $scope.$apply(function() {
              $scope.standardModel = model;
              quickMenu.refresh();
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
          $scope.status = init.translation.states.couldNotSave;
          $scope.$apply();
        });
      }
      catch(err) {
        //Model is not yet created, fires when routeParams.id === 'new'
      }
    };

    $scope.delete = function() {
      if (typeof $scope.model.id!=='undefined') {
        if (confirm(init.translation.warnings.confirmAlbumDeletion)) {
          bmmApi.albumDelete($scope.model.id).always(function() {
            $scope.$apply(function() {
              alert('Album deleted');
              quickMenu.refresh();
              $location.path( '/' );
            });
          });
        }
      }
    };

    var findAvailableTranslations = function() {
      $scope.availableLanguages = [];
      bmmApi.root().done(function(root) {
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
              !confirm(init.translation.warnings.confirmTranslatedDeletion)) {
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
          alert(init.translation.page.editor.missingTitle);
        }
      }
    }, true);

    $scope.$watch('model', function(model) {
      if (modelLoaded) {
        $scope.status = init.translation.states.changesPerformed;
      }

      if (typeof model.parent_id!=='undefined'&&model.parent_id!==null) {
        bmmApi.albumGet(model.parent_id, init.mediaLanguage, {
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

    var suggestedTags = [
      'Parents\' and Couples Conference',
      'Childrens\' Conference',
      'Sisters\' Conference',
      'Sisters\' Meeting',
      'Sisters\' Feast',
      'Brothers\' Feast',
      'Brothers\' Conference',
      'Brothers\' Conference Grenland',
      'Brothers\' Meeting',
      'Youth Conference',
      'Youth Meeting',
      'BrunstadTV',
      'Brunstadfeast',
      'Feast Meeting',
      'Fellowship-Weekend',
      'Conference',
      'Summer Conference',
      'Summer Conference July',
      'Summer Conference August',
      'Easter Conference',
      'Bible Competition',
      'New Year Conference',
      'Pentecostal Conference',
      'Feast',
      'child-favorites',
      'instrumental',
      'mp3-kilden',
      'Meeting',
      'Mission Meeting',
      'Opening'
    ];

    var findAvailableTags = function() {
      $scope.availableTags = [];
      $.each(suggestedTags, function() {
        var available = this, found=false;
        $.each($scope.model.tags, function() {
          if (this===available) {
            found = true;
          }
        });
        if (!found) {
          $scope.availableTags.push(available);
        }
      });
    };

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

      var translation = init.titles.album;

      $.each($scope.model.tags, function() {
        var tag = this;
        if (typeof translation[tag]!=='undefined') {
          $.each($scope.model.translations, function() {

            if (typeof translation[tag][this.language]!=='undefined') {
              this.title = translation[tag][this.language];

              if (tag==='Meeting') {
                this.title+=' '+$filter('locals')($scope.model.published_at, this.language);
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
      url: bmmApi.getserverUrli()+'album/'+$routeParams.id+'/cover',
      method: 'PUT'
    };

    //FETCH ALBUMS
    $scope.parentAlbums = [];
    $scope.findParentAlbums = function(year, _album) {

      bmmApi.albumPublishedYear(year, {
        unpublished: 'show'
      }, init.mediaLanguage).done(function(albums) {

        $scope.$apply(function() {
          $.each(albums, function() {
            var album = bmmFormatterAlbum.resolve(this);
            $scope.parentAlbums.push(album);
          });

          $scope.parentAlbums.push({
            title: '['+init.translation.page.editor.noParentAlbum+']',
            id: null
          });
          $scope.parentAlbums.reverse();
          if (typeof _album!=='undefined') {
            $.each($scope.parentAlbums, function(index) {
              if (this.id===_album.id) {
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