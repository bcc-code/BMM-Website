'use strict';

angular.module('bmmApp')
  .controller('TrackUploaderCtrl', function ($scope, $timeout, $fileUploader, $routeParams, bmmApi, bmmUser) {
    
    var trackUploader = $fileUploader.create({
      method: 'POST',
      scope: $scope, //to automatically update the html
      url: bmmApi.getserverUrli()+'track/'+$routeParams.id+'/files/',
      withCredentials: true,
      headers: {
        'Accept-Language': bmmUser.mediaLanguage
      }
    });

    trackUploader.bind('afteraddingfile', function (event, item) {

      $scope.$parent.save({
        done: function(saved) {
          if (saved) {
            trackUploader.uploadItem(item);
          }
        }
      });
      
    });

    trackUploader.bind('progress', function (event, item, progress) {

      $scope.$apply(function() {
        $scope.progress = progress;
      });
      
    });

    trackUploader.bind('success', function (/*event, xhr*/) {

      /*

      Used to manually fetch file, but now parent.loadTrack() does the job.

      var typeFound = false;
      var getFile = function() {
        return {
          duration: xhr.getResponseHeader('X-File-Duration'),
          mime_type: xhr.getResponseHeader('X-File-MimeType'),
          path: xhr.getResponseHeader('X-File-Path'),
          size: xhr.getResponseHeader('X-File-Size')
        };
      };

      if (typeof $scope.$parent.media!=='undefined') {
        $.each($scope.$parent.media, function() {
          //If mediatype exists, push file
          if (this.type===xhr.getResponseHeader('X-File-MediaType')) {
            typeFound = true;
            this.files.push(getFile());
          }
        });

        //If mediatype didnt exist, push type and file
        if (!typeFound) {
          $scope.$parent.media.push({
            type: xhr.getResponseHeader('X-File-MediaType'),
            files: [getFile()]
          });
        }
      //If medias didnt exist, push media, type and file
      } else {
        $scope.$parent.media = [{
          type: xhr.getResponseHeader('X-File-MediaType'),
          files: [getFile()]
        }];
      }

      $scope.$apply();
      */

      $scope.$parent.loadTrack();

    });

  });