'use strict';

angular.module('bmmApp')
  .controller('AlbumCtrl', function ($scope, $filter, $location, $rootScope, $routeParams, $timeout, bmmApi, bmmUser, locals) {

    var modelLoaded=false;
    $scope.model = {};
    $scope.status = 'No changes';
    $scope.originalLanguage;

    var fetchModel = function() {
      return bmmApi.albumGet($routeParams.id, '', { raw: true });
    };

    fetchModel().done(function(model) {
      $scope.$apply(function() {
        $scope.model = model;
        findAvailableTranslations();
        findAvailableTags();
      });
      modelLoaded = true;
    });

    var saveModel = function() {
      //Delete parts that's unexpected by the API
      delete $scope.model._meta;
      delete $scope.model.id;
      return bmmApi.albumPut($routeParams.id, angular.copy($scope.model));
    };

    $scope.save = function() {
      $scope.status = 'Attempt to save, please wait...';
      saveModel().done(function() {
        $scope.status = 'Save succeed, fetching new data.';
        $scope.$apply();
        fetchModel().done(function() {
          $scope.$apply(); //Model-watcher updates status to changed
          $timeout(function() { //Secure that watcher is fired
            $scope.status = 'Saved'; //Update status
            $scope.$apply(); //Render status
          });
          $scope.$apply(function() {
            $scope.status = 'Saved';
          });
        }).fail(function() {
          $scope.status = 'Could not fetch new data, check your internet connection.';
          $scope.$apply();
        });
      }).fail(function() {
        $scope.status = 'Could not save, check your internet connection.';
        $scope.$apply();
      });
    };

    $scope.availableLanguages = [];
    var findAvailableTranslations = function() {
      bmmApi.root().done(function(root) {
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
      if (typeof oldLang!='undefined') {
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

    $scope.$watch('model', function() {
      if (modelLoaded) {
        $scope.status = 'Changes performed';
      }
    }, true);

    $scope.$watch('model.original_language', function(lang) {
      if (typeof $scope.model.translations!=='undefined') {
        $.each($scope.model.translations, function(index) {
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

    $scope.availableTags = [];
    var findAvailableTags = function() {
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

      var translation = bmmUser.getTags().album;

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

  });