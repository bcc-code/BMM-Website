'use strict';

angular.module('bmmApp')
  .controller('UploaderCtrl', function ($scope, $fileUploader, _api) {

    $scope.progress = 0;

    $scope.initialize = function(options) {

      if (typeof options.method==='undefined') {
        options.method = 'POST';
      }

      var uploader = $fileUploader.create({
        method: 'POST',
        scope: $scope, //to automatically update the html
        url: options.url,
        withCredentials: true,
        removeAfterUpload: true,
        headers: {
          'X-HTTP-METHOD-OVERRIDE': options.method,
          'Authorization': 'Basic '+window.btoa(_api.getCredentials())
        }
      });

      uploader.bind('afteraddingfile', function (event, item) {

        var lang = '';
        if (typeof $scope.$parent.edited!=='undefined'&&
            typeof $scope.$parent.edited.language!=='undefined') {
          lang = $scope.$parent.edited.language;
        }

        if (typeof $scope.$parent.uploadUrl!=='undefined') {
          item.url = $scope.$parent.uploadUrl;
        }

        item.headers['Accept-Language'] = lang;

        $scope.$parent.save({
          done: function() {

            var file = new FileReader();
            file.readAsDataURL(item.file);

            file.onload = function (e) {
              $scope.file = e.target.result;
            };

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

      uploader.bind('error', function () {
        var tranScope = $scope.$parent.$parent.translation.page.editor;
        alert(tranScope.uploadError);
      });

    };

  });
