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
    var references = $scope.activeItems.map(function(item) {
      return { id: item.id };
    });

    var podcastCollection = {
      type: 'podcast_collection',
      podcast_references: references
    };

    return _api.activePodcastsPut(podcastCollection);
  };

  $scope.createNewTrackList = function() {
    $scope.save()
      .then(function() {
        return _api.podcastPost({
          type: 'podcast',
          translations: [
            {
              language: 'en',
              title: 'New item'
            }
          ],
          query: {
            tags: []
          }
        });
      })
      .then(init);
  };

  $scope.getTitle = function(item) {
    var translation = item.translations.find(function (translation) {
      return translation.language === _init.language;
    });

    if(!translation) {
      translation = item.translations[0];
    }

    return translation.title;
  };

  $scope.deactivateTrackList = function(item) {
    var activeItems = $scope.activeItems;
    var availableItems = $scope.availableItems;

    var index = activeItems.indexOf(item);

    var disabledItems = activeItems.splice(index, 1);

    availableItems.push.apply(availableItems, disabledItems);
  };

  $scope.activateTrackList = function(item) {
    var activeItems = $scope.activeItems;
    var availableItems = $scope.availableItems;

    var index = availableItems.indexOf(item);

    var activatedItems = availableItems.splice(index, 1);

    activeItems.push.apply(activeItems, activatedItems);
  };

  $scope.editPodcast = function(item) {
    $scope.selectedItem = item;
  };

  $scope.deleteTrackList = function(item) {
    _api.podcastIdDelete(item.id)
      .then(function() {
        var index = $scope.availableItems.indexOf(item);
        $scope.availableItems.splice(index, 1);
      });
  };

  $scope.savePodcast = function() {
    var id = $scope.selectedItem.id;
    var item = angular.copy($scope.selectedItem);

    if(id) {
      delete item.id;
      _api.podcastIdPut(id, item);
    } else {
      _api.podcastPost(item);
    }
  }

  function init() {
    _api.trackListGet($scope.type, {raw: true}).then(function(items) {
      $scope.activeItems = items;
    });

    _api.unpublishedTrackListGet($scope.type, {raw: true}).then(function(items) {
      $scope.availableItems = items;
    });
  };

  init();

  $scope.sortableOptions = {
    axis: 'y',
    handle: '.sort_handle',
    'ui-floating': false
  };
});
