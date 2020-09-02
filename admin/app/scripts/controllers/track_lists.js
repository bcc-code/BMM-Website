'use strict';

angular.module('bmmApp')
  .controller('TrackListsCtrl', function(
    $scope,
    _api,
    _init,
    type
  ) {
  $scope.init = _init;
  $scope.type = type;

  $scope.save = function() {
    var podcastReferences = $scope.activeItems.map(function(podcast) {
      return { id: podcast.id };
    });

    var podcastCollection = {
      type: 'podcast_collection',
      podcast_references: podcastReferences
    };

    return _api.activePodcastsPut(podcastCollection);
  };

  $scope.createNewPodcast = function() {
    $scope.save()
      .then(function() {
        return _api.podcastPost({
          type: 'podcast',
          translations: [
            {
              language: 'en',
              title: 'New podcast'
            }
          ],
          query: {
            tags: []
          }
        });
      })
      .then(init);
  };

  $scope.getTitle = function(podcast) {
    var title;

    var translation = podcast.translations.find(function (translation) {
      return translation.language === _init.language;
    });

    if(!translation) {
      translation = podcast.translations[0];
    }

    return translation.title;
  };

  $scope.deactivatePodcast = function(podcast) {
    var activeItems = $scope.activeItems;
    var availablePodcasts = $scope.availablePodcasts;

    var index = activeItems.indexOf(podcast);

    var disabledPodcasts = activeItems.splice(index, 1);

    availablePodcasts.push.apply(availablePodcasts, disabledPodcasts);
  };

  $scope.activatePodcast = function(podcast) {
    var activeItems = $scope.activeItems;
    var availablePodcasts = $scope.availablePodcasts;

    var index = availablePodcasts.indexOf(podcast);

    var activatedPodcasts = availablePodcasts.splice(index, 1);

    activeItems.push.apply(activeItems, activatedPodcasts);
  };

  $scope.editPodcast = function(podcast) {
    $scope.podcast = podcast;
  };

  $scope.deletePodcast = function(podcast) {
    _api.podcastIdDelete(podcast.id)
      .then(function() {
        var index = $scope.availablePodcasts.indexOf(podcast);
        $scope.availablePodcasts.splice(index, 1);
      });
  };

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

  function init() {
    console.log("init", $scope);
    _api.trackListGet($scope.type, {raw: true}).then(function(items) {
      $scope.activeItems = items;
    });

    _api.unpublishedTrackListGet($scope.type, {raw: true}).then(function(items) {
      $scope.availablePodcasts = items;
    });
  };

  init();

  $scope.sortableOptions = {
    axis: 'y',
    handle: '.sort_handle',
    'ui-floating': false
  };
});
