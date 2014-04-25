'use strict';

angular.module('bmmApp')
  .controller('ImageUploaderCtrl', function ($scope, $timeout, $fileUploader, $routeParams, bmmApi, bmmUser) {
    
    var coverUploader = $fileUploader.create({
      method: 'POST',
      scope: $scope, //to automatically update the html
      url: bmmApi.getserverUrli()+'track/'+$routeParams.id+'/cover?_method=PUT',
      withCredentials: true,
      headers: {
        'Accept-Language': bmmUser.mediaLanguage
      }
    });

    coverUploader.bind('afteraddingfile', function (event, item) {

      var oFReader = new FileReader();
      oFReader.readAsDataURL(item.file);

      oFReader.onload = function (oFREvent) {
        $scope.coverImage = oFREvent.target.result;
      };
//withCredentials
      $scope.$parent.coverForUpload = item.file;

      coverUploader.uploadItem(item);

    });

    coverUploader.bind('success', function (event, xhr) {

      $scope.$parent.cover = xhr.getResponseHeader('X-Cover-Path');
      $scope.$parent.save();
      $scope.$apply();

    });

  });
