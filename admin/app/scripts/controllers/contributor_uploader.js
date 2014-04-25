'use strict';

angular.module('bmmApp')
  .controller('ContributorUploaderCtrl', function ($scope, $timeout, $fileUploader, $routeParams, bmmApi) {
    
    var coverUploader = $fileUploader.create({
      method: 'POST',
      scope: $scope, //to automatically update the html
      url: bmmApi.getserverUrli()+'contributor/'+$routeParams.id+'/cover?_method=PUT',
      withCredentials: true
    });

    coverUploader.bind('afteraddingfile', function (event, item) {

      var oFReader = new FileReader();
      oFReader.readAsDataURL(item.file);

      oFReader.onload = function (oFREvent) {
        $scope.$parent.coverImage = oFREvent.target.result;
      };
    //withCredentials
      $scope.$parent.coverForUpload = item.file;

      coverUploader.uploadItem(item);

    });

    coverUploader.bind('success', function (event, xhr) {

      $scope.$parent.cover = xhr.getResponseHeader('X-Cover-Path');
      $scope.$apply();
      alert('Bilde er lastet opp!');

    });

  });
