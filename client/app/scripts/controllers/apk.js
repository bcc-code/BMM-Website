'use strict';

angular.module('bmmApp')
  .controller('ApkCtrl', function (
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

    $scope.url = _api.getApkUrl();

    $window.location.href = $scope.url;

  });
