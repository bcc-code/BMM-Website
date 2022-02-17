'use strict';

angular.module('bmmApp')
  .controller('GroupGoalCtrl', function (
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
    $scope.goal = null;

    $(window).off('scrollBottom');

    var load = function() {
      _api.groupGoalGet($routeParams.secret).done(function (data) {
        $scope.goal = data;
        $scope.title = data.name;
        console.log("data", data);
        $scope.load = false;
        if (data.joined) {
          $scope.onTrack = 70;
          $scope.onTrackCatchingUp = 90;
        }
      });
    };
    load();

    $scope.joinGoal = function() {
      $scope.load = true;
      _api.groupGoalJoin($routeParams.secret).done(function(data) {
        load();
      });
    };
    //https://int-bmm.brunstad.org/playlist/shared/1f2cd7c9842a4f21a4a718a3457833cf
    //https://127.0.0.1:9001/groupgoal/d2aad03add0f43bd877995b872311f82

    // This is a workaround to fix the scroll problem (#5317 in VSTS)
    $scope.setMinHeight = function() {
      $('body').find('div.frontend').css('min-height', '1000px');
    };
    $scope.removeMinHeight = function() {
      $('body').find('div.frontend').css('min-height', 'initial');
    };

  });
