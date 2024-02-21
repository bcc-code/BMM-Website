'use strict';

angular.module('bmmApp')
  .controller('DownloadCtrl', function (
    $scope,
    $rootScope,
    $routeParams,
    $timeout,
    $location,
    $window,
    _api,
    _track,
    _init
  ) {
    $scope.data = null;
    $scope.load = true;

    _api.getDownloadLinks().done(function(data){
      $scope.data = data;
      $scope.load = false;
    });

  });
