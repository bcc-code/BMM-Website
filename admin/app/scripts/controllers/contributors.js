'use strict';

angular.module('bmmApp')
  .controller('ContributorsCtrl', function ($scope, $routeParams, bmmApi) {
    
    $scope.contributor={};
    $scope.$parent.contributors = true;

    if (typeof $routeParams.id!=='undefined') {
      bmmApi.contributorIdGet($routeParams.id).done(function(contributor) {

        $scope.coverImage = contributor.cover;
        $scope.contributor = contributor;
        $scope.$apply();

      });
    }

    $scope.removeCover = function() {

      delete $scope.contributor.id;
      delete $scope.contributor._meta;

      $scope.contributor.cover=null;
      bmmApi.contributorIdPut($routeParams.id,
        angular.copy($scope.contributor)
      ).done(function() {
        alert('Bilde er slettet');
        $scope.$apply(function() {
          $scope.coverImage=null;
        });
      });

    };

  });
