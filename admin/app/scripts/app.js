'use strict';

angular.module('bmmApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'bmmLibApp',
  'ui.bootstrap',
  'ui.sortable',
  'angularFileUpload',
  'mgcrea.ngStrap'
]).run(['$route', '$location', function($route, $location)  {

    //Removes unwanted urlchange done by topbar while developing
    if ($location.url().indexOf('&topbarInitialized=true')>-1) {
      $location.url($location.url().replace('&topbarInitialized=true',''));
    }

    //Fastclick attempts to kill some touch delay for IPAD/IPHONE
    $(function() {
      FastClick.attach(document.body);
    });

  }])
  .config(['$routeProvider', function ($routeProvider) {

    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/pages/index.html',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/waitings', {
        templateUrl: 'views/pages/waitings.html',
        controller: 'WaitingsCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/search/:term', {
        templateUrl: 'views/pages/search.html',
        controller: 'SearchCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/album/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/album/:id/:add', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/album/:id/:parentId/:language/:languages/:date', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/track/:id', {
        templateUrl: 'views/pages/track.html',
        controller: 'TrackCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/track/:id/:parentId/:order/:language/:languages/:date', {
        templateUrl: 'views/pages/track.html',
        controller: 'TrackCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/contributors', {
        templateUrl: 'views/pages/contributors.html',
        controller: 'ContributorsCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/contributors/:id', {
        templateUrl: 'views/pages/contributors.html',
        controller: 'ContributorsCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .when('/users', {
        templateUrl: 'views/pages/users.html',
        controller: 'UsersCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(true); }]}
      })
      .otherwise({
        redirectTo: '/dashboard'
      });
    
  }]);