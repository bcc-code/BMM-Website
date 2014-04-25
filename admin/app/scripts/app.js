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

    $(function() {
      FastClick.attach(document.body);
    });

    if ($location.protocol()!=='https') {
      window.location = 'https://'+window.location.href.substr(5);
    } else {
      $route.reload();
    }

  }])
  .config(['$routeProvider', function ($routeProvider) {

    $routeProvider
      .when('/welcome', {
        templateUrl: 'views/pages/index.html'
      })
      .when('/ftp_linker', {
        templateUrl: 'views/pages/ftp_linker.html',
        controller: 'FtpLinkerCtrl'
      })
      .when('/search/:term', {
        templateUrl: 'views/pages/search.html',
        controller: 'SearchCtrl'
      })
      .when('/album/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl'
      })
      .when('/track/:id', {
        templateUrl: 'views/pages/track.html',
        controller: 'TrackCtrl'
      })
      .when('/contributors', {
        templateUrl: 'views/pages/contributors.html',
        controller: 'ContributorsCtrl'
      })
      .when('/contributors/:id', {
        templateUrl: 'views/pages/contributors.html',
        controller: 'ContributorsCtrl'
      })
      .when('/permissions', {
        templateUrl: 'views/pages/permissions.html',
        controller: 'PermissionsCtrl'
      })
      .otherwise({
        redirectTo: '/welcome'
      });
    
  }]);