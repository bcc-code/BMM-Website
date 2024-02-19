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
    $scope.selectedChurch = null;
    $scope.failed = false;

    $(window).off('scrollBottom');

    var load = function(churchId) {
      _api.churchStatisticsGet(churchId).done(function (data) {
        $scope.data = data;
        $scope.load = false;
        $scope.selectedChurch = {id: data.church_id, name: data.church};
      }).fail(function(data){
        $scope.failed = true;
        $scope.load = false;
        $scope.message = data.responseJSON?.message ?? "an unexpected error occurred";
      });
    };
    load("");

    $scope.changeChurch = function(selected) {
      console.log("test", selected);
      $scope.load = true;
      load(selected.id);
    }

    // This is a workaround to fix the scroll problem (#5317 in VSTS)
    $scope.setMinHeight = function() {
      $('body').find('div.frontend').css('min-height', '1000px');
    };
    $scope.removeMinHeight = function() {
      $('body').find('div.frontend').css('min-height', 'initial');
    };

  });
