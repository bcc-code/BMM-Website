'use strict';

angular.module('bmmApp')
  .controller('YearInReviewCtrl', function(
    $scope,
    $routeParams,
    _api,
    _init
  ) {
  $scope.init = _init;
  $scope.url = _api.getserverUrli() + 'statistics/wrapped-image';

});
