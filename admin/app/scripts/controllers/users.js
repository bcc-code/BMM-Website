'use strict';

angular.module('bmmApp')
  .controller('UsersCtrl', function ($scope, $timeout, bmmApi) {

    $scope.status = init.translation.states.loadingUsers;

    $scope.$watch('userSearch', function(name) {
      if (name!=='') {
        bmmApi.userSuggesterCompletionGet(name, {
          //roles: []
        }).done(function(users) {
          $scope.$apply(function() {

            $.each(users, function() {

              var perm = this.perm = {
                ROLE_ADMINISTRATOR: false,
                ROLE_ALBUM_MANAGER: false,
                ROLE_TRACK_MANAGER: false,
                ROLE_CONTRIBUTOR_MANAGER: false
              };

              $.each(this.roles, function() {
                perm[this] = true;
              });

            });

            $scope.searchResults = users;

          });
        });
      } else {
        $scope.contributors = [];
      }
    });

    $scope.updateUser = function(user, search) {

      var _roles = [];

      $.each(user.perm, function(key) {
        if (this) {
          _roles.push(key);
        }
      });

      $scope.status = init.translation.states.savingChanges;

      if (search) {
        bmmApi.userUsernamePut(user.id, {
          roles: _roles
        }).always(function() {
          $scope.$apply(function() {
            $timeout(function() {
              $scope.fetchUsers();
            }, 2000);
          });
        });
      } else {
        bmmApi.userUsernamePut(user.id, {
          roles: _roles
        }).always(function() {
          $scope.status = init.translation.states.allIsWell;
        });
      }
    };

    $scope.fetchUsers = function() {

      $scope.status = init.translation.states.loadingUsers;

      bmmApi.userGet({
        size: 500,
        roles: [
          'ROLE_ADMINISTRATOR',
          'ROLE_ALBUM_MANAGER',
          'ROLE_TRACK_MANAGER',
          'ROLE_CONTRIBUTOR_MANAGER'
        ]
      }).done(function(users) {
        $scope.$apply(function() {

          $.each(users, function() {

            var perm = this.perm = {
              ROLE_ADMINISTRATOR: false,
              ROLE_ALBUM_MANAGER: false,
              ROLE_TRACK_MANAGER: false,
              ROLE_CONTRIBUTOR_MANAGER: false
            };

            $.each(this.roles, function() {
              perm[this] = true;
            });

          });

          $scope.users = users;
          $scope.status = init.translation.states.allIsWell;

        });
      });
    };
    $scope.fetchUsers();

  });
