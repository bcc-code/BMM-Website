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

    $scope.content = {};
    $scope.test = "HEI!!";
    $scope.steps = [
      {
        name: 'Album',
        locked: false,
        template: 'views/pages/wizard/album.html',
        children: [
          {
            name: 'Cover Image',
            locked: true,
            template: 'views/pages/wizard/step3.html',
            children: []
          },
          {
            name: 'Settings',
            locked: true,
            template: 'views/pages/wizard/step3.html',
            children: [{
              name: 'Cover Image',
              locked: false,
              template: 'views/pages/wizard/year.html',
              children: []
            }]
          },
          {
            name: 'Translations',
            locked: false,
            template: 'views/pages/wizard/cover.html',
            children: []
          },
          {
            name: 'Tags',
            locked: true,
            template: 'views/pages/wizard/step3.html',
            children: []
          },
          {
            name: 'Tracks',
            locked: true,
            template: 'views/pages/wizard/step3.html',
            children: []
          },
          {
            name: 'Sub Albums',
            locked: true,
            template: 'views/pages/wizard/step3.html',
            children: []
          }
        ]
      }
    ];

    $scope.content.template = $scope.steps[0].template;

    $scope.loadTemplate = function(step) {
      if (!step.locked) {
        $scope.content.active = step.name;
        $scope.content.template = step.template;
      }
    };

  });