'use strict';

angular.module('bmmDebug')
  .controller('MainCtrl', function ($scope, $timeout, $filter) {
    
    $scope.addAlbum = function(title, id, children) {
      console.log(title);
      console.log(id);
      console.log(children);
      children.push({
        roleName : 'Navn',
        roleId: 2,
        collapsed: true,
        group: 'track',
        children: []
      });
    };

    $scope.roleList = [{
      roleName : 'Navn',
      roleId: 0,
      collapsed: true,
      group: 'year',
      children: [{
        roleName : 'Navn',
        roleId: 1,
        collapsed: true,
        group: 'album',
        children: [{
          roleName : 'Navn',
          roleId: 2,
          collapsed: true,
          group: 'track',
          children: []
        }]
      }]
    },{
      roleName : 'Navn',
      roleId: 3,
      collapsed: true,
      group: 'year',
      children: [{
        roleName : 'Navn',
        roleId: 4,
        collapsed: true,
        group: 'album',
        children: [{
          roleName : 'Navn',
          roleId: 5,
          collapsed: true,
          group: 'track',
          children: []
        }]
      }]
    },{
      roleName : 'Navn',
      roleId: 6,
      collapsed: true,
      group: 'year',
      children: [{
        roleName : 'Navn',
        roleId: 7,
        collapsed: true,
        group: 'album',
        children: [{
          roleName : 'Navn',
          roleId: 8,
          collapsed: true,
          group: 'track',
          children: []
        }]
      }]
    }];

    //$scope.bibleSolved = $filter('bmmBibleVerse')($scope.bible);

    $scope.$watch('bible', function(text) {
      $scope.bibleSolved = $filter('bmmBibleVerse')(text);
    });

    $scope.go = function () {
      console.log('click');
    };

    $scope.videoSlider = [
      {title: ''},
      {title: ''},
      {title: ''}
    ];

    $timeout(function() {

      $scope.vid = [
        {title: ''},
        {title: ''},
        {title: ''},
        {title: ''},
        {title: ''}
      ];

    },1500);

    $scope.playlist = [
      {nr: 1, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor spsuor sit amet'},
      {nr: 2, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 3, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 4, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 5, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum Lorem ipsu doset'},
      {nr: 6, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 7, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 2, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 3, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 4, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 5, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum Lorem ipsu doset'},
      {nr: 6, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 7, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 2, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 3, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 4, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 5, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum Lorem ipsu doset'},
      {nr: 6, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 7, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 2, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 3, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 4, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 5, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum Lorem ipsu doset'},
      {nr: 6, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 7, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 2, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 3, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 4, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 5, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum Lorem ipsu doset'},
      {nr: 6, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 7, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 2, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 3, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 4, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 5, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum Lorem ipsu doset'},
      {nr: 6, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 7, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 2, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 3, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 4, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 5, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum Lorem ipsu doset'},
      {nr: 6, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 7, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 2, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 3, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 4, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 5, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum Lorem ipsu doset'},
      {nr: 6, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'},
      {nr: 7, name: 'Navn Navnesen', duration: '00:00', content: 'Lorem ipsum dolor sit amet'}
    ];

  });
