'use strict';

angular.module('bmmApp')
  .controller('PodcastCtrl', function(
    $scope,
    _api,
    _init,
    $routeParams
  ) {
  $scope.init = _init;
  $scope.availableLanguages = _init.root.languages;

  $scope.uploadCover = {
      url: _api.getserverUrli()+'podcast/'+$routeParams.id+'/cover',
      method: 'PUT'
    };

  if($routeParams.id) {
    _api.podcastIdGet($routeParams.id, {raw: true}).then(function(podcast) {
      $scope.podcast = podcast;
    });
  }

  $scope.savePodcast = function() {
    var podcastId = $scope.podcast.id;

    var podcast = angular.copy($scope.podcast);

    if(podcastId) {
      delete podcast.id;
      _api.podcastIdPut(podcastId, podcast);
    } else {
      _api.podcastPost(podcast);
    }
  }

  $scope.removeTranslation = function(translation) {
    var translations = $scope.podcast.translations;
    var index = translations.indexOf(translation);
    if(index !== -1) {
      translations.splice(index, 1);
    }
  };

  $scope.addPodcastTranslation = function(language) {
    $scope.podcast.translations.push({
      language: language,
      title: ''
    });
  };

  $scope.addTag = function() {
    $scope.podcast.query.tags.push($scope.tag);
    $scope.tag = '';
  };

  $scope.removeTag = function(tag) {
    var tags = $scope.podcast.query.tags;
    var index = tags.indexOf(tag);
    tags.splice(index, 1);
  };

  //This filter functions filters out the languages
  //that are already selected. Prevents duplicates.
  $scope.exceptSelected = function(language) {
    if($scope.podcast) {
      var translations = $scope.podcast.translations
      for(var i = 0; i < translations.length; i++) {
        var translation = translations[i];

        if(translation.language === language) {
          return false;
        }
      }
    }
    return true;
  };
});