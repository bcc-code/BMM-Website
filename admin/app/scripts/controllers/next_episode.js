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

  var offset = 0;
  var nextEpisodeId = null;
  var datetime = new Date();

  var getNextEpisodeId = function(episodes) {
    // Info: Episodes are ordered newest first
    episodes.forEach(function(episode) {
      offset++;
      if (new Date(episode.published_at) > datetime) {
        nextEpisodeId = episode.id;
      } else {
        return;
      }
    });

    if (offset % 20 == 0 && episodes.length > 0) {
      // In case there are more than 20 unpublished episodes, we get nextEpisodeId from the next 20 episodes
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

  function init(offset) {
    $scope.loading = true;

    _api.podcastIdGet($routeParams.id).then(function(podcast) {
      $scope.podcast = podcast;

      _api.podcastTracksGet($routeParams.id, {from: offset, unpublished: 'only'}).then(function(podcast) {
        getNextEpisodeId(podcast);

        if (nextEpisodeId) {
          _api.trackGet(nextEpisodeId, {raw: true}).then(function(nextEpisode) {
            $scope.nextEpisode = nextEpisode;

            orderLanguages();
            detectDuplicateTitles();
            detectBigDifferenceInDuration();
            detectMissingLanguages();

            $scope.norwegianNotMainLanguage = nextEpisode.original_language != 'nb' ? true : false; 
            $scope.errors = $scope.missingLanguages || $scope.norwegianNotMainLanguage ? true : false;
            
          }).then(function(){
            doneLoading();
          });
        } else {
          doneLoading();
        }

      });

    }).fail(function(){
      doneLoading();
    });

  };

  init(offset);
});
