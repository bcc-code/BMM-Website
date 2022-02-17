'use strict';

// // enable this to debug OIDC. You can also enable it on the live page by pasting these 2 lines.
// Oidc.Log.logger = console;
// Oidc.Log.level = Oidc.Log.DEBUG;

angular.module('bmmApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'bmmLibApp',
  'ui.bootstrap',
  'ui.sortable',
  'ngTouch',
  'angulartics',
  'angulartics.application.insights',
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
    var auth0Domain = "https://login.bcc.no";
    ngOidcClientProvider.setSettings({
      authority: auth0Domain,
      client_id: "EPlaBVrMQc3gsuwUTA0D3aX0ZLXJ33C4",
      redirect_uri: url + "/redirect.html",
      silent_redirect_uri: url + "/silent-renew.html",
      post_logout_redirect_uri: url,
      response_type: "id_token token",
      scope: "openid profile",
      automaticSilentRenew: true,
      filterProtocolClaims: true,
      extraQueryParams: {
        audience: "https://bmm-api.brunstad.org"
      },
      metadata: {
        issuer: auth0Domain + "/",
        authorization_endpoint: auth0Domain + "/authorize",
        userinfo_endpoint: auth0Domain + "/userinfo",
        end_session_endpoint: auth0Domain + "/v2/logout",
        jwks_uri: auth0Domain + "/.well-known/jwks.json"
      }
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
      .when('/messages', {
        templateUrl: 'views/pages/speeches.html',
        controller: 'SpeechesCtrl',
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
      .when('/groupgoal/:secret', {
        templateUrl: 'views/pages/groupgoal.html',
        controller: 'GroupGoalCtrl',
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
