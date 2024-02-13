'use strict';

angular.module('bmmApp')
  .controller('StatisticsCtrl', function (
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
    $scope.load = true;
    $scope.data = null;

    $(window).off('scrollBottom');

    var load = function() {
      _api.churchStatisticsGet($routeParams.secret).done(function (data) {
        console.log("data", data);
        $scope.data = data;
        console.log("data", data);
        $scope.load = false;
      });
    };
    load();

    // This is a workaround to fix the scroll problem (#5317 in VSTS)
    $scope.setMinHeight = function() {
      $('body').find('div.frontend').css('min-height', '1000px');
    };
    $scope.removeMinHeight = function() {
      $('body').find('div.frontend').css('min-height', 'initial');
    };

  });
