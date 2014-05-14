'use strict';

angular.module('bmmApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'bmmLibApp',
  'ui.bootstrap',
  'ui.sortable',
  'ngTouch'
]).run(['$route', '$location', 'bmmApi',
    function($route, $location, bmmApi)  {

    // 'https://bmm-api.brunstad.org/' 'https://127.0.0.1/bmm/api/web/app_dev.php/' 'https://devapibmm.brunstad.org/'
    bmmApi.serverUrl('https://devapibmm.brunstad.org/');

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
      .when('/welcome', {
        templateUrl: 'views/pages/index.html',
        controller: 'WelcomeCtrl'
      })
      .when('/music', {
        templateUrl: 'views/pages/music.html',
        controller: 'MusicCtrl'
      })
      .when('/speeches', {
        templateUrl: 'views/pages/speeches.html',
        controller: 'SpeechesCtrl'
      })
      .when('/video', {
        templateUrl: 'views/pages/video.html',
        controller: 'VideoCtrl'
      })
      .when('/archive', {
        templateUrl: 'views/pages/archive.html',
        controller: 'ArchiveCtrl'
      })
      .when('/audiobooks', {
        templateUrl: 'views/pages/audiobooks.html',
        controller: 'AudiobooksCtrl'
      })
      .when('/search/:term', {
        templateUrl: 'views/pages/search.html',
        controller: 'SearchCtrl'
      })
      .when('/search', {
        redirectTo: '/search/no results'
      })
      .when('/album/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl'
      })
      .when('/track/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'TrackCtrl'
      })
      .when('/track/:id/:language', {
        templateUrl: 'views/pages/album.html',
        controller: 'TrackCtrl'
      })
      .when('/playlist/:playlist', {
        templateUrl: 'views/pages/playlist.html',
        controller: 'PlaylistCtrl'
      })
      .when('/playlist/:playlist/:id', {
        templateUrl: 'views/pages/playlist.html',
        controller: 'PlaylistCtrl'
      })
      .otherwise({
        redirectTo: '/welcome'
      });
    
  }]);