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
    var references = $scope.publishedItems.map(function(item) {
      return { id: item.id };
    });

    var collection = {
      type: $scope.type + '_collection',
      references: references,
      podcast_references: references // we need this for backwards compatibility
    };

    return _api.trackListOverviewUpdate($scope.type, collection);
  };

  $scope.createNewTrackList = function() {
    $scope.save()
      .then(function() {
        return _api.trackListCreate($scope.type, {
          type: $scope.type,
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

  $scope.unpublishTrackList = function(item) {
    var publishedItems = $scope.publishedItems;
    var availableItems = $scope.availableItems;

    var index = publishedItems.indexOf(item);
    var disabledItems = publishedItems.splice(index, 1);

    availableItems.push.apply(availableItems, disabledItems);
  };

  $scope.publishTrackList = function(item) {
    var publishedItems = $scope.publishedItems;
    var availableItems = $scope.availableItems;

    var index = availableItems.indexOf(item);
    var activatedItems = availableItems.splice(index, 1);

    publishedItems.push.apply(publishedItems, activatedItems);
  };

  $scope.editPodcast = function(item) {
    $scope.selectedItem = item;
  };

  $scope.deleteTrackList = function(item) {
    _api.trackListDelete($scope.type, item.id)
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
      _api.trackListUpdate($scope.type, id, item);
    } else {
      _api.trackListCreate($scope.type, item);
    }
  }

  function init() {
    _api.trackListOverview($scope.type, {}).then(function(result) {
      $scope.publishedItems = result.published;
      $scope.availableItems = result.unpublished;
    });
  };

  init();

  $scope.sortableOptions = {
    axis: 'y',
    handle: '.sort_handle',
    'ui-floating': false
  };
});
