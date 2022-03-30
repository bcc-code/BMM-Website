'use strict';

angular.module('bmmApp')
  .controller('TrackListCtrl', function(
    $scope,
    _api,
    _init,
    $routeParams
  ) {
  $scope.init = _init;
  $scope.availableLanguages = _init.root.languages;
  $scope.tag = '';

  $scope.loadTrackList = function(id) {
    _api.trackListIdGet($scope.type, id, {raw: true}).done(function(trackList) {
      $scope.$apply(function() {
        $scope.current = trackList;
        $scope.uploadUrl = _api.getserverUrli() + $scope.type + '/' + trackList.id + '/cover';
      });
    });
  };

  if(typeof $routeParams.id!=='undefined') {
    $scope.type = $scope.$parent.type;
    $scope.loadTrackList($routeParams.id);
  }

  $scope.save = function(options) {
    $scope.saveTrackList(options);
  }

  $scope.saveTrackList = function(options) {
    var id = $scope.current.id;
    var trackList = angular.copy($scope.current);
    if(id) {
      delete trackList.id;
      _api.trackListUpdate($scope.type, id, trackList).done(function(){
        $scope.loadTrackList(id);
        if (typeof options!=='undefined') {
          options.done();
        }
      });
    } else {
      _api.trackListCreate($scope.type, trackList);
    }
  }

  $scope.uploadCover = {
    url: _api.getserverUrli() + $scope.type + '/' + $routeParams.id + '/cover',
    method: 'PUT'
  };

  $scope.refreshModel = function() {
    $scope.loadTrackList($scope.current.id);
  };

  $scope.removeTranslation = function(translation) {
    var translations = $scope.current.translations;
    var index = translations.indexOf(translation);
    if(index !== -1) {
      translations.splice(index, 1);
    }
  };

  $scope.addTranslation = function(language) {
    $scope.current.translations.push({
      language: language,
      title: ''
    });
  };

  $scope.addTag = function() {
    if($scope.type === 'podcast')
      $scope.current.query.tags.push($scope.tag);
    else
      $scope.current.tags.push($scope.tag);
    $scope.tag = '';
  };

  $scope.removeTag = function(tag) {
    var tags = $scope.getTags();
    var index = tags.indexOf(tag);
    tags.splice(index, 1);
  };

  $scope.getTags = function() {
    if($scope.type === 'podcast')
      return $scope.current.query.tags;
    else
      return $scope.current.tags;
  }

  //This filter functions filters out the languages
  //that are already selected. Prevents duplicates.
  $scope.exceptSelected = function(language) {
    if($scope.current) {
      var translations = $scope.current.translations;
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
