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

    $scope.arch = null;

    //ToDo: doesn't work on a lot of devices
    if (navigator.userAgentData){
      navigator.userAgentData.getHighEntropyValues(['architecture']).then(function(result){
        console.log("result", result);
        $scope.arch = result;
      });
    }

    $scope.linkForArchitecture = function(){
      if ($scope.arch) {
        if ($scope.arch.platform == "macOS"){
          if ($scope.arch.architecture == "arm")
            return $scope.data.mac_arm;
          return $scope.data.mac_intel;
        }
        if ($scope.arch.mobile){
          if ($scope.arch.platform == "iOS")
            return $scope.data.ios;
          return $scope.data.android;
        }
      }
      // Windows seems like a reasonable default value
      return $scope.data.windows;
    }

    _api.getDownloadLinks().done(function(data){
      $scope.data = data;
      $scope.load = false;
    });

  });
