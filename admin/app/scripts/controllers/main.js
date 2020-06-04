/**
 * Main controller: Loaded one time, always accessable
 */

'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $rootScope,
    $location,
    $route,
    _init,
    _session,
    _play,
    _quickMenu,
    _api_queue,
    _modifiedResponseTransformer
  ) {

    $rootScope.init = $scope.init = _init;
    $scope.api_queue = _api_queue;

    _init.load.complete.promise.then(function() {

      $scope.session = _session.current;

      $scope.clearMenu = function() {
        $scope.quickMenu.year='';
        $scope.quickMenu.albums=[];
        $scope.quickMenu.childAlbums=[];
        $scope.quickMenu.childTracks=[];
      }

      $scope.userIs = function(role) {
        if(_init.user.roles.indexOf('ROLE_ADMINISTRATOR') !== -1) {
          return true;
        }

        return _init.user.roles.indexOf(role) !== -1;
      }

      $scope.go = function (path) { $location.path(path); };

      $scope.setContentLanguages = function(languages) {
        _session.current.contentLanguages = languages;
        $route.reload();
      };

      _session.setWebsiteLanguage($scope.session.websiteLanguage, _init);

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
