'use strict';

angular.module('bmmLibApp')
  .controller('ApiCtrl', function ($scope, bmmApi) {
    
    bmmApi.serverUrl('https://'+window.location.hostname+'/bmm/api/web/app.php/');

    //bmmApi.loginRedirect();

    bmmApi.root().done(function(data) {
      $scope.$apply(function() {
        $scope.root = data;
      });
    });

    bmmApi.user().done(function(data) {
      $scope.$apply(function() {
        $scope.user = data;
      });
    });

    bmmApi.albumLatest({
      size: 2,
      from: 2
    }).done(function(data) {
      $scope.$apply(function() {
        $scope.albumLatest = data;
      });
    });

    bmmApi.albumGet(38619).done(function(data) {
      $scope.$apply(function() {
        $scope.albumGet = data;
      });
    });

    bmmApi.facetsPublishedYears().done(function(data) {
      $scope.$apply(function() {
        $scope.facetsPublishedYears = data;
      });
    });

    bmmApi.search('kåre').done(function(data) {
      $scope.$apply(function() {
        $scope.search = data;
      });
    });

    bmmApi.suggest('aslaksen').done(function(data) {
      $scope.$apply(function() {
        $scope.suggest = data;
      });
    });

    bmmApi.trackLatest().done(function(data) {
      $scope.$apply(function() {
        $scope.trackLatest = data;
      });
    });

    bmmApi.trackRel('Påske').done(function(data) {
      $scope.$apply(function() {
        $scope.trackRel = data;
      });
    });

    bmmApi.trackGet(38933).done(function(data) {
      $scope.$apply(function() {
        $scope.trackGet = data;
      });
    });

    bmmApi.trackFiles(38933).done(function(data) {
      $scope.$apply(function() {
        $scope.trackFiles = data;
      });
    });

    bmmApi.userTrackCollectionGet(1).done(function(data) {
      $scope.$apply(function() {
        $scope.userTrackCollectionGet = data;
      });
    });

  });