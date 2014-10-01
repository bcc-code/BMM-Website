'use strict';

angular.module('bmmApp')
  .controller('WizardCtrl', function (
    $scope,
    $filter,
    $location,
    $routeParams,
    $timeout,
    _waitings,
    _play,
    _api,
    _init,
    _track,
    _album,
    _quickMenu
    ) {

    $scope.model = {};
    $scope.content = {};

    $scope.lock = {};
    $scope.lock.album = true;
    $scope.lock.track = true;
    $scope.lock.subalbum = true;
    $scope.lock.subtrack = true;

    $scope.steps = [
      {
        name: 'Album',
        group: false,
        template: 'views/pages/wizard/album.html',
        children: [
          {
            name: 'Cover Image',
            group: 'album',
            template: 'views/pages/wizard/step3.html',
            children: []
          },
          {
            name: 'Settings',
            group: 'album',
            template: 'views/pages/wizard/step3.html',
            children: []
          },
          {
            name: 'Translations',
            group: 'album',
            template: 'views/pages/wizard/cover.html',
            children: []
          },
          {
            name: 'Tags',
            group: 'album',
            template: 'views/pages/wizard/step3.html',
            children: []
          },
          {
            name: 'Track',
            group: 'album',
            template: 'views/pages/wizard/step3.html',
            children: [
              {
                name: 'Cover',
                group: 'track',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Settings',
                group: 'track',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Upload & Translations',
                group: 'track',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Playlists',
                group: 'track',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Contributors',
                group: 'track',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Books related',
                group: 'track',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Bible relations',
                group: 'track',
                template: 'views/pages/wizard/step3.html',
                children: []
              }
            ]
          },
          {
            name: 'Sub Album',
            group: 'album',
            template: 'views/pages/wizard/step3.html',
            children: [
              {
                name: 'Cover Image',
                group: 'subalbum',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Settings',
                group: 'subalbum',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Translations',
                group: 'subalbum',
                template: 'views/pages/wizard/cover.html',
                children: []
              },
              {
                name: 'Tags',
                group: 'subalbum',
                template: 'views/pages/wizard/step3.html',
                children: []
              },
              {
                name: 'Track',
                group: 'subalbum',
                template: 'views/pages/wizard/step3.html',
                children: [
                  {
                    name: 'Cover',
                    group: 'subtrack',
                    template: 'views/pages/wizard/step3.html',
                    children: []
                  },
                  {
                    name: 'Settings',
                    group: 'subtrack',
                    template: 'views/pages/wizard/step3.html',
                    children: []
                  },
                  {
                    name: 'Upload & Translations',
                    group: 'subtrack',
                    template: 'views/pages/wizard/step3.html',
                    children: []
                  },
                  {
                    name: 'Playlists',
                    group: 'subtrack',
                    template: 'views/pages/wizard/step3.html',
                    children: []
                  },
                  {
                    name: 'Contributors',
                    group: 'subtrack',
                    template: 'views/pages/wizard/step3.html',
                    children: []
                  },
                  {
                    name: 'Books related',
                    group: 'subtrack',
                    template: 'views/pages/wizard/step3.html',
                    children: []
                  },
                  {
                    name: 'Bible relations',
                    group: 'subtrack',
                    template: 'views/pages/wizard/step3.html',
                    children: []
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    $scope.content.template = $scope.steps[0].template;

    $scope.loadTemplate = function(step) {
      if (!$scope.lock[step.group]) {
        $scope.content.active = step.name+step.group;
        $scope.content.template = step.template;
      }
    };

    $scope.albums = {};

    $scope.search = {
      album: function(from, to, term) {
        _api.search(term, {
          'datetime-from': from,
          'datetime-to': to,
          'resource-type': ['album'],
          'unpublished': ['show']
        }, _init.contentLanguage).done(function(albums) {

          var rootAlbums = [];

          $.each(albums, function() {
            if (this.parent_id!==parseInt(this.parent_id)) {
              rootAlbums.push(this);
            }
          });

          $scope.$apply(function() {
            $scope.albums = rootAlbums;
            console.log(rootAlbums);
          });
        });
      }
    };

    $scope.select = {

      album: function(id) {
        _api.albumGet(id, '', { raw: true }).done(function(album) {
          $scope.$apply(function() {
            $scope.album = album;
            $scope.lock.album = false;
            console.log(album);
          });
        });

      }

    };


  });