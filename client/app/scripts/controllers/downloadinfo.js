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
    $rootScope.downloadInfo = {
      showPopup: true,
      title: "Downloading messages is not available",
      message: "Due to copyright restrictions, the ability to download messages from BMM has been removed. If you need a message you can contact "
    };
    $scope.pageTitle = $rootScope.downloadInfo.title;
  });
