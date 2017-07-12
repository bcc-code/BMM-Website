'use strict';

angular.module('bmmApp')
  .controller('PodcastsCtrl', function(
    $scope,
    _api,
    _init
  ) {
  $scope.init = _init;

  $scope.save = function() {
    var podcastReferences = $scope.activePodcasts.map(function(podcast) {
      return { id: podcast.id };
    });

    var podcastCollection = {
      type: 'podcast_collection',
      podcast_references: podcastReferences
    };

    _api.activePodcastsPut(podcastCollection);
  };

  $scope.createNewPodcast = function() {
    _api.podcastPost({
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
    }).then(init);
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
    var activePodcasts = $scope.activePodcasts;
    var availablePodcasts = $scope.availablePodcasts;

    var index = activePodcasts.indexOf(podcast);

    var disabledPodcasts = activePodcasts.splice(index, 1);

    availablePodcasts.push.apply(availablePodcasts, disabledPodcasts);
  };

  $scope.activatePodcast = function(podcast) {
    var activePodcasts = $scope.activePodcasts;
    var availablePodcasts = $scope.availablePodcasts;

    var index = availablePodcasts.indexOf(podcast);

    var activatedPodcasts = availablePodcasts.splice(index, 1);

    activePodcasts.push.apply(activePodcasts, activatedPodcasts);
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
    _api.podcastsGet({raw: true}).then(function(podcasts) {
      $scope.activePodcasts = podcasts;
    });

    _api.unpublishedPodcastsGet({raw: true}).then(function(podcasts) {
      $scope.availablePodcasts = podcasts;
    });
  };

  init();

  $scope.sortableOptions = {
    axis: 'y',
    handle: '.sort_handle',
    'ui-floating': false
  };
});
