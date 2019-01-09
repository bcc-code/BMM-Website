'use strict';

angular.module('bmmApp')
  .controller('NextEpisodeCtrl', function(
    $scope,
    $routeParams,
    _api,
    _init
  ) {
  $scope.init = _init;
  $scope.differencePercentage = 10;

  $scope.nextEpisodesIds = [];
  $scope.episodeShowedIndex = 0;

  var offset = 0;
  var maxEpisodes = 30;
  var minOldEpisodes = 5;
  var oldEpisodesIndex = 0;
  var datetime = new Date();

  var getNextEpisodesIds = function(episodes) {
    // Info: Episodes are ordered newest first
    episodes.forEach(function(episode) {
      offset++;
      $scope.nextEpisodesIds.unshift(episode.id);

      if($scope.nextEpisodesIds.length > maxEpisodes) {
        $scope.nextEpisodesIds.pop();
      }

      if (new Date(episode.published_at) < datetime) {
        if ($scope.episodeShowedIndex == 0) {
          $scope.episodeShowedIndex = Math.abs(maxEpisodes - offset);

          // In case there are unpublished episodes set the index to the episode which is going to be published next
          if ($scope.episodeShowedIndex < maxEpisodes-1) {
            $scope.episodeShowedIndex++;
          }
        }
        
        oldEpisodesIndex++;
        if (oldEpisodesIndex == minOldEpisodes && $scope.nextEpisodesIds.length == maxEpisodes) {
          return;
        }
      }
    });

    if (oldEpisodesIndex < minOldEpisodes) {
      // In case all the episodes are unpublished episodes we load the next 30 episodes
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
    $scope.missingLanguages = [];
    
    if ($scope.nextEpisodesIds[$scope.episodeShowedIndex]) {
      _api.trackGet($scope.nextEpisodesIds[$scope.episodeShowedIndex], {raw: true}).then(function(nextEpisode) {
        $scope.nextEpisode = nextEpisode;

        orderLanguages();
        detectDuplicateTitles();
        detectBigDifferenceInDuration();
        detectMissingLanguages();

        $scope.nextEpisode.published = new Date(nextEpisode.published_at) < datetime;
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

      _api.podcastTracksGet($routeParams.id, {size: maxEpisodes, from: offset, unpublished: 'show'}).then(function(podcast) {
        getNextEpisodesIds(podcast);
        getEpisodeInformation();
      });

    }).fail(function(){
      doneLoading();
    });
  };

  init(offset);
});
