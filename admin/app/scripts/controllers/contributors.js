'use strict';

angular.module('bmmApp')
  .controller('ContributorsCtrl', function ($scope, $location, $timeout, $routeParams, bmmApi, bmmFormatterTrack, bmmPlay, init) {
    
    $scope.model={};
    $scope.status = 'Waiting for selection';

    $scope.loadContributor = function(id) {

      $scope.status = 'Loading contributor, please wait...';

      bmmApi.contributorIdGet(id, {
        unpublished: 'show'
      }).done (function(model) {

        $scope.$apply(function() {
          $scope.model = model;
          $scope.status = 'Loading tracks...';
          $scope.uploadUrl = bmmApi.getserverUrli()+'contributor/'+model.id+'/cover';
        });

        bmmApi.contributorTracksGet(model.name, {
          size: 100
        }, init.mediaLanguage).done(function(data) {

          $scope.$apply(function() {

            $scope.tracks = [];
            $.each(data, function() {
              if (this.type==='track') {
                $scope.tracks.push(bmmFormatterTrack.resolve(this));
              }
            });

            $scope.status = 'Contributor successfully loaded';

          });

        });

      });

    };

    if (typeof $routeParams.id!=='undefined') {
      $scope.loadContributor($routeParams.id);
    }

    $scope.save = function(options) {
      $scope.status = 'Saving contributor, please wait...';
      //Delete parts that's unexpected by the API
      var toApi = angular.copy($scope.model);
      delete toApi._meta;
      delete toApi.id;
      bmmApi.contributorIdPut($scope.model.id, toApi).done(function() {
        $scope.loadContributor($scope.model.id);
        options.done();
      });
    };

    $scope.delete = function() {
      if (confirm('ARE YOU REALLY SURE YOU WANT TO DELETE THIS CONTRIBUTOR? ALL LINKED TRACKS WILL BE DELETED!!!')) {
        $scope.status = 'Deleting contributor, please wait...';

        bmmApi.contributorIdDelete($scope.model.id).always(function() {
          $scope.$apply(function() {
            $location.path('contributors');
          });
        });
      }
    };

    $scope.uploadCover = {
      url: bmmApi.getserverUrli()+'contributor/'+$routeParams.id+'/cover',
      method: 'PUT'
    };
    $scope.uploadUrl = bmmApi.getserverUrli()+'contributor/'+$scope.model.id+'/cover';

    $scope.refreshModel = function() {
      $scope.loadContributor($scope.model.id);
    };

    $scope.play = function(track) {
      bmmPlay.setPlay([track], 0);
    };

    $scope.addContributor = function(contributor) {
      if (contributor!=='') {
        bmmApi.contributorPost({
          type: 'contributor',
          is_visible: true,
          name: contributor,
          cover_upload: null
        }).always(function() {
          $timeout(function() {
            bmmApi.contributorSuggesterCompletionGet($scope.contributor).done(function(data) {
              $scope.$apply(function() {
                $scope.contributors = data;
              });
            });
          }, 1000);
        });
      }
    };

    $scope.$watch('contributor', function(name) {
      if (name!=='') {
        bmmApi.contributorSuggesterCompletionGet(name).done(function(data) {
          $scope.$apply(function() {
            $scope.contributors = data;
          });
        });
      } else {
        $scope.contributors = [];
      }
    });

  });
