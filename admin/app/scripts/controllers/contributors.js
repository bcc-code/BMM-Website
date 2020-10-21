'use strict';

angular.module('bmmApp')
  .controller('ContributorsCtrl', function (
    $scope,
    $location,
    $timeout,
    $routeParams,
    _api,
    _track,
    _play,
    _init) {
    
    $scope.model={};
    $scope.status = _init.translation.states.waitingForSelection;

    $scope.loadContributor = function(id) {

      $scope.status = _init.translation.states.loadingContributor;

      _api.contributorIdGet(id, {
        unpublished: 'show'
      }).done (function(model) {

        $scope.$apply(function() {
          $scope.model = model;
          $scope.status = _init.translation.states.loadingTracks;
          $scope.uploadUrl = _api.getserverUrli()+'contributor/'+model.id+'/cover';
        });

        _api.contributorTracksGet(model.id, {
          size: 100
        }).done(function(data) {

          $scope.$apply(function() {

            $scope.tracks = [];
            $.each(data, function() {
              if (this.type==='track') {
                $scope.tracks.push(_track.resolve(this));
              }
            });

            $scope.status = _init.translation.states.contributorLoaded;

          });

        });

      });

    };

    if (typeof $routeParams.id!=='undefined') {
      $scope.loadContributor($routeParams.id);
    }

    $scope.save = function(options) {
      $scope.status = _init.translation.states.savingContributor;
      //Delete parts that's unexpected by the API
      var toApi = angular.copy($scope.model);
      delete toApi._meta;
      delete toApi.id;
      if(toApi.cover){
        var prefix_url = _api.getFileServerUrl();
        toApi.cover = toApi.cover.replace(prefix_url, "").split("?last-changed=")[0];
      }
      _api.contributorIdPut($scope.model.id, toApi).done(function() {
        $scope.loadContributor($scope.model.id);
        if (typeof options!=='undefined') {
          options.done();
        }
      });
    };

    $scope.delete = function() {
      if (confirm(_init.translation.warnings.confirmContributorDeletion)) {
        $scope.status = _init.translation.states.deletingContributor;

        _api.contributorIdDelete($scope.model.id).always(function() {
          $scope.$apply(function() {
            $location.path('contributors');
          });
        });
      }
    };

    $scope.uploadCover = {
      url: _api.getserverUrli()+'contributor/'+$routeParams.id+'/cover',
      method: 'PUT'
    };
    $scope.uploadUrl = _api.getserverUrli()+'contributor/'+$scope.model.id+'/cover';

    $scope.refreshModel = function() {
      $scope.loadContributor($scope.model.id);
    };

    $scope.play = function(track) {
      _play.setPlay([track], 0);
    };

    $scope.addContributor = function(contributor) {
      if (contributor!=='') {
        _api.contributorPost({
          type: 'contributor',
          is_visible: true,
          name: contributor,
          cover_upload: null
        }).always(function() {
          $timeout(function() {
            _api.contributorSuggesterCompletionGet($scope.contributor, {
              size: 1000
            }).done(function(data) {
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
        _api.contributorSuggesterCompletionGet(name, {
          size: 1000
        }).done(function(data) {
          $scope.$apply(function() {
            $scope.contributors = data;
          });
        });
      } else {
        $scope.contributors = [];
      }
    });

  });
