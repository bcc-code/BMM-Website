'use strict';

angular.module('bmmApp')
  .controller('NotificationsCtrl', function(
    $scope,
    _api,
    _init
  ) {

    $scope.init = _init;

    $scope.languageToAdd = _init.root.languages[0];

    $scope.sendNotification = function() {
      var notification = {
        translations: $scope.notificationTranslations
      }

      _api.sendNotification(notification);
    };

    $scope.removeTranslation = function(translation) {
      var translations = $scope.notificationTranslations;
      var index = translations.indexOf(translation);
      if(index !== -1) {
        translations.splice(index, 1);
      }
    }

    $scope.addNewTranslation = function(language) {
      this.notificationTranslations.push({
        language: language
      });
    };

    //This filter functions filters out the languages
    //that are already selected. Prevents duplicates.
    $scope.exceptSelected = function(language) {
      for(var i = 0; i < $scope.notificationTranslations.length; i++) {
        var translation = $scope.notificationTranslations[i];

        if(translation.language === language) {
          return false;
        }
      }

      return true;
    };

    $scope.notificationTranslations = [{
      language: 'nb'
    }];
    $scope.availableLanguages = _init.root.languages;

    $scope.sortableOptions = {
      axis: 'y',
      'ui-floating': false
    };
  });