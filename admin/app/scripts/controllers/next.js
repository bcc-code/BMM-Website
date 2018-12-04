'use strict';

angular.module('bmmApp')
  .controller('NextCtrl', function(
    $scope,
    $routeParams,
    _api,
    _init
  ) {
  $scope.init = _init;
  $scope.missingLanguages = [];

  var offset = 0;
  var nextEpisodeId = null;
  var datetime = new Date();

  var getNextEpisodeId = function(episodes) {
    // Info: Episodes are ordered newest first
    episodes.forEach(function(episode) {
      offset++;
      if(new Date(episode.published_at) > datetime){
        nextEpisodeId = episode.id;
      } else {
        return;
      }
    });

    if(offset % 20 == 0) {
      // In case there are more than 20 unpublished episodes, we get nextEpisodeIdfrom the next 20 episodes
      init(offset);
    }
  };

  var detectDuplicateTitles = function(){
    $scope.nextEpisode.translations.forEach(function(translation) {
      var translationsCopy = $scope.nextEpisode.translations.map(function(translationCopy) { 
        if(translationCopy.language != translation.language) return translationCopy.title; 
      });

      if(translationsCopy.indexOf(translation.title) !== -1) {
        translation.duplicate_title = true;
      }
    });
  }

  var detectBigDifferenceInDuration = function(){
    var originalLanguageDuration = 0;

    $scope.nextEpisode.translations.forEach(function(translation) {
      if(translation.language == $scope.nextEpisode.original_language && translation.media != null) {
        originalLanguageDuration = translation.media[0].files[0].duration;
        return;
      }
    });

    $scope.nextEpisode.translations.forEach(function(translation) {
      if(translation.media != null)
        if(Math.abs(translation.media[0].files[0].duration - originalLanguageDuration) >= originalLanguageDuration * 0.1) {
          translation.big_difference_in_duration = true;
        }
    });
  }

  var detectMissingLanguages = function(){
    var expectedLanguages = ["nb", "de", "en", "nl", "fr"];
    var availableLanguages = $scope.nextEpisode.translations.map(function(translation) { return translation.language; });
    
    expectedLanguages.forEach(function(expectedLang) {
      if(availableLanguages.indexOf(expectedLang) === -1) {
        $scope.missingLanguages.push(expectedLang);
      }
    });
  }

  function init(offset) {
    _api.podcastIdGet($routeParams.id).then(function(podcast) {
      $scope.podcast = podcast;
    });

    _api.podcastTracksGet($routeParams.id, {from: offset, unpublished: 'only'}).then(function(podcast) {
      getNextEpisodeId(podcast);

      if(nextEpisodeId) {
        _api.trackGet(nextEpisodeId, {raw: true}).then(function(nextEpisode) {
          $scope.nextEpisode = nextEpisode;

          detectDuplicateTitles();
          detectBigDifferenceInDuration();
          detectMissingLanguages();
        });
      }
    });
  };

  init(offset);

  $scope.sortableOptions = {
    axis: 'y',
    handle: '.sort_handle',
    'ui-floating': false
  };
});
