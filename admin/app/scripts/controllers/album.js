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
    bmmFormatterAlbum
  ) {

    var modelLoaded=false, newAlbum=false;

    if ($routeParams.id==='new') {
      newAlbum = true;
    }

    $scope.model = {}; //Raw
    $scope.standardModel = {}; //Standard
    $scope.hasChildAlbums = false;
    $scope.status = 'No changes';

    $scope.fetchModel = function(_raw) {
      if (!newAlbum) {
        if (typeof _raw==='undefined'||_raw) {
          return bmmApi.albumGet($routeParams.id, '', { raw: true });
        } else {
          return bmmApi.albumGet($routeParams.id, init.mediaLanguage);
        }
      } else {
        $scope.model = {
          parent_id: null,
          type: 'album',
          published_at: new Date(),
          original_language: init.mediaLanguage,
          translations: [{
            language: init.mediaLanguage
          }],
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
          });
          modelLoaded = true;
        });
        $scope.fetchModel(false).done(function(model) {
          $scope.$apply(function() {
            $scope.standardModel = model;
          });
          if (typeof model.children!=='undefined') {
            $scope.hasChildAlbums = false;
            $scope.tracks = [];
            $scope.$apply(function() {
              $.each(model.children, function() {
                if (this.type==='album') {
                  $scope.hasChildAlbums = true;
                } else {
                  $scope.tracks.push(this);
                }
              });
            });
          }
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
      if (newAlbum) {
        bmmApi.albumPost(toApi).always(function(xhr) {
          if (xhr.status===201) {
            $location.path(/album/+xhr.getResponseHeader('X-Document-Id'));
          } else {
            $scope.status = 'Could not create album, errorcode: '+xhr.status;
          }
        });
      } else {
        return bmmApi.albumPut($routeParams.id, toApi);
      }
    };

    $scope.save = function(options) {
      $scope.status = 'Attempt to save, please wait...';
      try {
        saveModel().done(function() {
          $scope.status = 'Save succeed, fetching new data.';
          $scope.$apply();
          $scope.fetchModel().done(function(model) {
            $scope.$apply(); //Model-watcher updates status to changed
            $scope.model = model;
            findAvailableTranslations();
            findAvailableTags();
            $timeout(function() { //Secure that watcher is fired
              $scope.status = 'Saved'; //Update status
              $scope.$apply(); //Render status
            });
            $scope.$apply(function() {
              $scope.status = 'Saved';
              if (typeof options!=='undefined'&&typeof options.done!=='undefined') {
                options.done();
              }
            });
          }).fail(function() {
            $scope.status = 'Could not fetch new data, check your internet connection.';
            $scope.$apply();
          });
          $scope.fetchModel(false).done(function(model) {
            $scope.$apply(function() {
              $scope.standardModel = model;
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
          $scope.status = 'Could not save, check your internet connection.';
          $scope.$apply();
        });
      }
      catch(err) {
        //Model is not yet created, fires when routeParams.id === 'new'
      }
    };

    $scope.delete = function() {
      if (typeof $scope.model.id!=='undefined') {
        if (confirm('Are you sure you want to delete album with all its sub albums and tracks?')) {
          bmmApi.albumDelete($scope.model.id).always(function() {
            $scope.$apply(function() {
              alert('Album deleted');
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
          $scope.switchLanguage($scope.model.original_language);
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
              !confirm($scope.$parent.translation.page.editor.confirmTranslatedDeletion)) {
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
      if (typeof newEdit!=='undefined'&&newEdit.title==='') {
        newEdit.is_visible = false;
        //Inform why change cant be done when trying to publish
        if (newEdit.is_visible===oldEdit.is_visible&&
            newEdit.language===oldEdit.language&&
            newEdit.title===oldEdit.title) {
          alert($scope.$parent.translation.page.editor.missingTitle);
        }
      }
    }, true);

    $scope.$watch('model', function(model) {
      if (modelLoaded) {
        $scope.status = 'Changes performed';
      }

      if (typeof model.parent_id!=='undefined'&&model.parent_id!==null) {
        bmmApi.albumGet(model.parent_id, init.mediaLanguage).done(function(album) {
          $scope.$apply(function() {
            $scope.albumParentYear = parseInt($filter('date')(album.published_at, 'yyyy'),10);
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

            }

          });
        }

      });

    };

    $scope.uploadCover = {
      url: bmmApi.getserverUrli()+'album/'+$routeParams.id+'/cover'
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
            title: '['+$scope.$parent.translation.page.editor.noParentAlbum+']',
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