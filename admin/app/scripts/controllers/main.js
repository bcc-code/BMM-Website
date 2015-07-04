/**
 * Main controller: Loaded one time, always accessable
 */

'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $location,
    $route,
    _init,
    _play,
    _quickMenu,
    _api_queue
  ) {

    $scope.init = _init;
    $scope.api_queue = _api_queue;

    _init.load.complete.promise.then(function() {

      $scope.go = function (path) { $location.path(path); };

      $scope.setContentLanguages = function(languages) {
        _init.contentLanguages = languages;
        $route.reload();
      };

      $scope.play = function(playlist, index) {
        _play.setPlay(playlist, index);
      };

      $scope.quickMenu = _quickMenu;
      $scope.quickMenu.findYears({
        done: function() {
          $scope.$apply();
        }
      });

      $scope.$on('quickMenu:updated', function() {
        $scope.$apply();
      });

      $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
      };

    });

  });
