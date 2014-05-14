'use strict';

angular.module('bmmApp')
  .controller('TrackCtrl', function (
    $filter,
    $scope,
    $location,
    $rootScope,
    $routeParams,
    $timeout,
    bmmTranslator,
    bmmApi,
    bmmPlay
  ) {

    $scope.model = {};

    var fetchModel = function() {
      return bmmApi.trackGet($routeParams.id, '', { raw: true });
    };

    var saveModel = function() {
      //Delete parts that's unexpected by the API
      delete $scope.model._meta;
      delete $scope.model.id;
      return bmmApi.trackPut($routeParams.id, angular.copy($scope.model));
    };

    fetchModel().done(function(model) {
      $scope.$apply(function() { $scope.model = model; });
      console.log(model);
      saveModel()
        .done(function(){
          fetchModel();
        })
        .fail(function(xhr){
          console.log(xhr);
        });

    });

  });
