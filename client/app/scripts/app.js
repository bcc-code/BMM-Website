'use strict';

angular.module('bmmApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'bmmLibApp',
  'ui.bootstrap',
  'ui.sortable',
  'ngTouch',
  'angulartics',
  'angulartics.google.analytics',
  'ng.oidcclient'
]).run(['$route', '$location', '_api', function($route, $location, _api)  {

    //Removes unwanted urlchange done by topbar while developing
    if ($location.url().indexOf('#topbarInitialized=true')>-1) {
      $location.url($location.url().replace('#topbarInitialized=true',''));
    }

    _api.cachingEnabled = true;

    //Fastclick attempts to kill some touch delay for IPAD/IPHONE
    $(function() {
      FastClick.attach(document.body);
    });

  }])
  .config(['ngOidcClientProvider', '$locationProvider', function(ngOidcClientProvider, $locationProvider) {
    var url = window.location.origin;
    ngOidcClientProvider.setSettings({
      authority: "https://login.bcc.no",
      client_id: "EPlaBVrMQc3gsuwUTA0D3aX0ZLXJ33C4",
      redirect_uri: url + "/redirect.html",
      silent_redirect_uri: url + "/silent-renew.html",
      post_logout_redirect_uri: url + "/logoutRedirect.html",

      response_type: "id_token token",
      scope: "openid profile",
      extraQueryParams: {
        audience: "https://bmm-api.brunstad.org"
      },

      automaticSilentRenew: true,

      filterProtocolClaims: true
    });
  }])
  .config(['$routeProvider','$locationProvider', '$analyticsProvider', '$compileProvider', function ($routeProvider, $locationProvider, $analyticsProvider, $compileProvider) {

    $compileProvider.debugInfoEnabled(false);

    $analyticsProvider.virtualPageviews(true);

    $routeProvider
      .when('/welcome', {
        templateUrl: 'views/pages/index.html',
        controller: 'WelcomeCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/music', {
        templateUrl: 'views/pages/music.html',
        controller: 'MusicCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/speeches', {
        templateUrl: 'views/pages/speeches.html',
        controller: 'SpeechesCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/video', {
        templateUrl: 'views/pages/video.html',
        controller: 'VideoCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/archive', {
        templateUrl: 'views/pages/archive.html',
        controller: 'ArchiveCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/audiobooks', {
        templateUrl: 'views/pages/audiobooks.html',
        controller: 'AudiobooksCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/album/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/track/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'TrackCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/track/:id/:language', {
        templateUrl: 'views/pages/album.html',
        controller: 'TrackCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/playlist/:playlist', {
        templateUrl: 'views/pages/playlist.html',
        controller: 'PlaylistCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/playlist/:playlist/:id', {
        templateUrl: 'views/pages/playlist.html',
        controller: 'PlaylistCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/playlist/:playlist/:id/:name', {
        templateUrl: 'views/pages/playlist.html',
        controller: 'PlaylistCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .when('/copyright', {
        templateUrl: 'views/pages/copyright.html',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(); }]}
      })
      .otherwise({
        redirectTo: '/welcome'
      });

    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);
