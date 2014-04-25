'use strict';

angular.module('bmmApp')
  .controller('PermissionsCtrl', function ($scope, bmmApi) {

    $scope.$parent.contributors = false;
    $scope.users = [];
    $('.bmm-view').off('scrollBottom');

    var usersFrom = 0, loading=true;
    $('.bmm-view').on('scrollBottom', function() {

      if (!loading) {

        $('.bmm-view').append('<div class="bmm-loading">Laster...</div>');
        loading = true;
        getUsers(usersFrom);

      }

    });

    var getUsers = function(_usersFrom) {

      if (typeof _usersFrom==='undefined') {
        _usersFrom = 0;
      }

      bmmApi.userGet({
        size: 50,
        from: _usersFrom
      }).done(function(users){

        $.each(users, function() {

          var user = {
            name: this.id
          };

          if ($.inArray('ROLE_ALBUM_MANAGER', this.roles)!==-1) {
            user.ROLE_ALBUM_MANAGER = true;
          } else {
            user.ROLE_ALBUM_MANAGER = false;
          }

          if ($.inArray('ROLE_TRACK_MANAGER', this.roles)!==-1) {
            user.ROLE_TRACK_MANAGER = true;
          } else {
            user.ROLE_TRACK_MANAGER = false;
          }

          if ($.inArray('ROLE_CONTRIBUTOR_MANAGER', this.roles)!==-1) {
            user.ROLE_CONTRIBUTOR_MANAGER = true;
          } else {
            user.ROLE_CONTRIBUTOR_MANAGER = false;
          }

          if ($.inArray('ROLE_ADMINISTRATOR', this.roles)!==-1) {
            user.ROLE_ADMINISTRATOR = true;
          } else {
            user.ROLE_ADMINISTRATOR = false;
          }

          $scope.users.push(user);

        });

        $scope.$apply(function(){
          loading = false;
          usersFrom+=50;
          $('.bmm-loading').remove();
        });

      });

    };

    getUsers();

    $scope.save = function() {

      $.each($scope.users, function() {

        var _roles = [];

        if (this.ROLE_ALBUM_MANAGER) { _roles.push('ROLE_ALBUM_MANAGER'); }
        if (this.ROLE_TRACK_MANAGER) { _roles.push('ROLE_TRACK_MANAGER'); }
        if (this.ROLE_CONTRIBUTOR_MANAGER) { _roles.push('ROLE_CONTRIBUTOR_MANAGER'); }
        if (this.ROLE_ADMINISTRATOR) { _roles.push('ROLE_ADMINISTRATOR'); }

        bmmApi.userUsernamePut(this.name, {
          roles: _roles
        });

      });

      alert('Lagret!');

    };

    $scope.addUser = function() {
      $scope.users.splice(0,0,{
        name: $scope.newUser,
        ROLE_ALBUM_MANAGER: false,
        ROLE_TRACK_MANAGER: false,
        ROLE_CONTRIBUTOR_MANAGER: false,
        ROLE_ADMINISTRATOR: false
      });
      $scope.newUser = '';
    };

    $scope.deleteUser = function(index) {
      if (confirm('Er du sikker på du vil slette denne brukeren?')) {
        bmmApi.userUsernameDelete($scope.users[index].name);
        $scope.users.splice(index, 1);
      }
    };

  });
