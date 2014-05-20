'use strict';

angular.module('bmmApp')
  .controller('UploaderCtrl', function ($scope, $fileUploader) {

    $scope.progress = 0;

    $scope.init = function(options) {

      if ( typeof options.language==='undefined') {
        options.language = '';
      }

      var uploader = $fileUploader.create({
        method: 'POST',
        scope: $scope, //to automatically update the html
        url: options.url, //bmmApi.getserverUrli()+'track/'+$routeParams.id+'/cover?_method=PUT',
        withCredentials: true,
        headers: {
          'Accept-Language': options.language,
          'X-HTTP-METHOD-OVERRIDE': 'PUT'
        }
      });

      uploader.bind('afteraddingfile', function (event, item) {

        $scope.$parent.save({
          done: function() {
            var file = new FileReader();
            file.readAsDataURL(item.file);

            file.onload = function (e) {
              $scope.file = e.target.result;
            };

            //withCredentials
            //$scope.$parent.coverForUpload = item.file;

            uploader.uploadItem(item);
          }
        });

      });

      uploader.bind('progress', function (event, item, progress) {
        $scope.$apply(function() {
          $scope.progress = progress;
        });
      });

      uploader.bind('success', function () {
        $scope.$parent.refreshModel();
        $scope.progress = 0;
      });

    };

  });
