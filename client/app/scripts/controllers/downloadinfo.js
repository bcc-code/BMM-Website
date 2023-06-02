'use strict';

angular.module('bmmApp')
  .controller('DownloadInfoCtrl', function (
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
    _init.downloadInfo.show();
  });
