'use strict';

angular.module('bmmApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'bmmLibApp',
  'ui.bootstrap',
  'ui.sortable',
  'ngTouch'
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
      .when('/welcome', {
        templateUrl: 'views/pages/index.html',
        controller: 'WelcomeCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/music', {
        templateUrl: 'views/pages/music.html',
        controller: 'MusicCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/speeches', {
        templateUrl: 'views/pages/speeches.html',
        controller: 'SpeechesCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/video', {
        templateUrl: 'views/pages/video.html',
        controller: 'VideoCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/archive', {
        templateUrl: 'views/pages/archive.html',
        controller: 'ArchiveCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/audiobooks', {
        templateUrl: 'views/pages/audiobooks.html',
        controller: 'AudiobooksCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/search/:term', {
        templateUrl: 'views/pages/search.html',
        controller: 'SearchCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/search', {
        redirectTo: '/search/no results',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/album/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/track/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'TrackCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/track/:id/:language', {
        templateUrl: 'views/pages/album.html',
        controller: 'TrackCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/playlist/:playlist', {
        templateUrl: 'views/pages/playlist.html',
        controller: 'PlaylistCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/playlist/:playlist/:id', {
        templateUrl: 'views/pages/playlist.html',
        controller: 'PlaylistCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .when('/playlist/:playlist/:id/:name', {
        templateUrl: 'views/pages/playlist.html',
        controller: 'PlaylistCtrl',
        resolve: { 'initData': ['init', function(init) { return init.promise(); }]}
      })
      .otherwise({
        redirectTo: '/welcome'
      });
    
  }]);