'use strict';

angular.module('bmmApp')
  .controller('NextEpisodeCtrl', function(
    $scope,
    $routeParams,
    _api,
    _init
  ) {
  $scope.init = _init;
  $scope.missingLanguages = [];
  $scope.differencePercentage = 10;

  $scope.nextEpisodesIds = [];
  $scope.episodeShowedIndex = 0;

  var offset = 0;
  var maxNextEpisodes = 5;
  var datetime = new Date();

  var getNextEpisodesIds = function(episodes) {
    // Info: Episodes are ordered newest first
    episodes.forEach(function(episode) {
      offset++;
      if (new Date(episode.published_at) > datetime) {
        $scope.nextEpisodesIds.unshift(episode.id);

        if($scope.nextEpisodesIds.length > maxNextEpisodes) {
          $scope.nextEpisodesIds.pop();
        }
      } else {
        return;
      }
    });

    if (offset % 20 == 0 && episodes.length > 0) {
      // In case there are more than 20 unpublished episodes, we get $scope.nextEpisodesIds from the next 20 episodes
      init(offset);
    }
  };

  var orderLanguages = function() {
    var languageOrdering = ["nb", "en", "de", "nl", "ro", "hu", "pl", "fr", "ru", "es", "fi", "pt", "tr", "it", "ta", "sl"];
    var orderedLanguages = [];

    for (var i = 0; i < languageOrdering.length; i++) {
      for (var j = 0; j < $scope.nextEpisode.translations.length; j++) {
        if ($scope.nextEpisode.translations[j].language == languageOrdering[i]) {
          orderedLanguages.push($scope.nextEpisode.translations[j]); 
          $scope.nextEpisode.translations.splice(j, 1);
          break;
        }
      }
    }

    $scope.nextEpisode.translations = orderedLanguages.concat($scope.nextEpisode.translations);
  }

  var detectDuplicateTitles = function(){
    for (var i = 0; i < $scope.nextEpisode.translations.length; i++) {
      for (var j = i+1; j < $scope.nextEpisode.translations.length; j++) {
        if ($scope.nextEpisode.translations[i].title == $scope.nextEpisode.translations[j].title) {
          $scope.nextEpisode.translations[i].duplicate_title = $scope.nextEpisode.translations[j].duplicate_title = true;
        }
      }
    }
  }

  var detectBigDifferenceInDuration = function(){
    var originalLanguageDuration = 0;

    $scope.nextEpisode.translations.forEach(function(translation) {
      if (translation.language == $scope.nextEpisode.original_language && translation.media != null) {
        originalLanguageDuration = translation.media[0].files[0].duration;
        return;
      }
    });

    var durationBoundary = originalLanguageDuration * $scope.differencePercentage / 100;

    $scope.nextEpisode.translations.forEach(function(translation) {
      if (translation.media != null)
        if (Math.abs(translation.media[0].files[0].duration - originalLanguageDuration) >= durationBoundary) {
          translation.big_difference_in_duration = true;
        }
    });
  }

  var detectMissingLanguages = function(){
    var expectedLanguages = ["nb", "en", "de", "nl", "ro", "hu", "pl", "fr", "ru"];
    var availableLanguages = $scope.nextEpisode.translations.map(function(translation) { return translation.language; });
    
    expectedLanguages.forEach(function(expectedLang) {
      if (availableLanguages.indexOf(expectedLang) === -1) {
        $scope.missingLanguages.push(expectedLang);
      }
    });
  }

  function doneLoading() {
    $scope.loading = false;
  }

  $scope.getPreviousEpisode = function() {
    $scope.episodeShowedIndex--;
    getEpisodeInformation();
  }

  $scope.getNextEpisode = function() {
    $scope.episodeShowedIndex++;
    getEpisodeInformation();
  }

  function getEpisodeInformation() {
    $scope.loading = true;
    if ($scope.nextEpisodesIds[$scope.episodeShowedIndex]) {
      _api.trackGet($scope.nextEpisodesIds[$scope.episodeShowedIndex], {raw: true}).then(function(nextEpisode) {
        $scope.nextEpisode = nextEpisode;

        orderLanguages();
        detectDuplicateTitles();
        detectBigDifferenceInDuration();
        detectMissingLanguages();

        $scope.norwegianNotMainLanguage = nextEpisode.original_language != 'nb' ? true : false; 
        $scope.errors = $scope.missingLanguages.length > 0 || $scope.norwegianNotMainLanguage ? true : false;
        
      }).then(function(){
        doneLoading();
      });
    } else {
      doneLoading();
    }
  }

  function init(offset) {
    $scope.loading = true;

    _api.podcastIdGet($routeParams.id).then(function(podcast) {
      $scope.podcast = podcast;

      _api.podcastTracksGet($routeParams.id, {from: offset, unpublished: 'only'}).then(function(podcast) {
        getNextEpisodesIds(podcast);
        getEpisodeInformation();
      });

    }).fail(function(){
      doneLoading();
    });
  };

  init(offset);
});
