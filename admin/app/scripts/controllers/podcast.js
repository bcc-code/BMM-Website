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

  $scope.loadPodcast = function(id) {
    _api.podcastIdGet(id, {raw: true}).done(function(podcast) {
      $scope.$apply(function() {
        $scope.podcast = podcast;
        $scope.uploadUrl = _api.getserverUrli()+'podcast/'+podcast.id+'/cover';
      });
    });
  };

  if(typeof $routeParams.id!=='undefined') {
    $scope.loadPodcast($routeParams.id);
  }

  $scope.save = function(options) {
    $scope.savePodcast(options);
  }

  $scope.savePodcast = function(options) {
    var podcastId = $scope.podcast.id;
    var podcast = angular.copy($scope.podcast);
    if(podcastId) {
      delete podcast.id;
      _api.podcastIdPut(podcastId, podcast).done(function(){
        $scope.loadPodcast(podcastId);
        if (typeof options!=='undefined') {
          options.done();
        }
      });
    } else {
      _api.podcastPost(podcast);
    }
  }

  $scope.uploadCover = {
    url: _api.getserverUrli()+'podcast/'+$routeParams.id+'/cover',
    method: 'PUT'
  };
  $scope.uploadUrl = _api.getserverUrli()+'podcast/'+$routeParams.id+'/cover';

  $scope.refreshModel = function() {
    $scope.loadPodcast($scope.podcast.id);
  };

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