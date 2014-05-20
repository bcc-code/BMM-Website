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
]).run(['$route', '$location', 'bmmApi', function($route, $location, bmmApi)  {

    //'https://bmm-api.brunstad.org/' 'https://127.0.0.1/bmm/api/web/app_dev.php/' 'https://devapibmm.brunstad.org/' https://api.bmm/
    bmmApi.serverUrl('https://bmm-api.brunstad.org/');

    //Port 9001 is used for development
    if ($location.protocol()!=='https'&&$location.port()!==9001) {
      var link = 'https://'+window.location.href.substr(5);
      link = link.replace('////','//'); //IE FIX
      window.location = link;
    } else {
      $route.reload();
    }

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
        resolve: { 'initData': function(init) { return init.promise(true); }}
      })
      .when('/waitings', {
        templateUrl: 'views/pages/waitings.html',
        controller: 'WaitingsCtrl',
        resolve: { 'initData': function(init) { return init.promise(true); }}
      })
      .when('/search/:term', {
        templateUrl: 'views/pages/search.html',
        controller: 'SearchCtrl',
        resolve: { 'initData': function(init) { return init.promise(true); }}
      })
      .when('/album/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { 'initData': function(init) { return init.promise(true); }}
      })
      .when('/track/:id', {
        templateUrl: 'views/pages/track.html',
        controller: 'TrackCtrl',
        resolve: { 'initData': function(init) { return init.promise(true); }}
      })
      .when('/contributors', {
        templateUrl: 'views/pages/contributors.html',
        controller: 'ContributorsCtrl',
        resolve: { 'initData': function(init) { return init.promise(true); }}
      })
      .when('/contributors/:id', {
        templateUrl: 'views/pages/contributors.html',
        controller: 'ContributorsCtrl',
        resolve: { 'initData': function(init) { return init.promise(true); }}
      })
      .when('/permissions', {
        templateUrl: 'views/pages/permissions.html',
        controller: 'PermissionsCtrl',
        resolve: { 'initData': function(init) { return init.promise(true); }}
      })
      .otherwise({
        redirectTo: '/welcome'
      });
    
  }]);