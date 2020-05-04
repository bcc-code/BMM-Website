'use strict';

angular.module('bmmApp')
  .controller('CustomNotificationsCtrl', function(
    $scope,
    _api,
    _init
  ) {

    $scope.init = _init;

    function reset() {
      $scope.notificationTranslations = [{
        language: 'nb'
      }];
      $scope.scheduledDateTime = new Date();
      $scope.actionUrl = "";

      $scope.languageToAdd = _init.root.languages[0];
    }

    reset();

    $scope.sendNotification = function() {
      var notification = {
        translations: $scope.notificationTranslations,
        scheduledDateTime: $scope.scheduledDateTime
      };

      _api.sendNotification(notification)
        .done(function(result) {
          reset();
          alert("successfully sent notification");
        }).fail(function(result) {
          alert("An unexpected error occurred");
        });
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

    $scope.availableLanguages = _init.root.languages;

    $scope.sortableOptions = {
      axis: 'y',
      handle: '.sort_handle',
      'ui-floating': false
    };
  });