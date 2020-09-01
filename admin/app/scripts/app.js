'use strict';

angular.module('bmmApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'bmmLibApp',
  'ui.bootstrap',
  'ui.sortable',
  'angularFileUpload',
  'mgcrea.ngStrap',
  'monospaced.elastic',
  'angular-duration-format',
  'angulartics',
  'angulartics.google.analytics',
  'ng.oidcclient'
]).run(['$route', '$location', function($route, $location)  {

    //Removes unwanted urlchange done by topbar while developing
    if ($location.url().indexOf('#topbarInitialized=true')>-1) {
      $location.url($location.url().replace('#topbarInitialized=true',''));
    }

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
      redirect_uri: url + "/admin/redirect.html",
      silent_redirect_uri: url + "/admin/silent-renew.html",
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
  .config(['$routeProvider','$locationProvider', '$analyticsProvider', function ($routeProvider, $locationProvider, $analyticsProvider) {

    $analyticsProvider.virtualPageviews(true);

    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/pages/index.html',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/next/:id', {
        templateUrl: 'views/pages/next-episode.html',
        controller: 'NextEpisodeCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/notifications', {
        templateUrl: 'views/pages/notifications.html',
        controller: 'NotificationsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/waitings', {
        templateUrl: 'views/pages/waitings.html',
        controller: 'WaitingsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/custom-notifications', {
        templateUrl: 'views/pages/custom-notifications.html',
        controller: 'CustomNotificationsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/track-lists', {
        templateUrl: 'views/pages/track-lists.html',
        controller: 'TrackListsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/podcasts', {
        templateUrl: 'views/pages/podcasts.html',
        controller: 'PodcastsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/podcasts/:id', {
        templateUrl: 'views/pages/podcasts.html',
        controller: 'PodcastsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/search/:term', {
        templateUrl: 'views/pages/search.html',
        controller: 'SearchCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/album/:id', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/album/:id/recording-list', {
        templateUrl: 'views/pages/album-recording-list.html',
        controller: 'AlbumRecordingListCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/album/:id/:add', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/album/:id/:parentId/:language/:languages/:date', {
        templateUrl: 'views/pages/album.html',
        controller: 'AlbumCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/track/:id', {
        templateUrl: 'views/pages/track.html',
        controller: 'TrackCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/track/:id/:parentId/:order/:language/:languages/:date', {
        templateUrl: 'views/pages/track.html',
        controller: 'TrackCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/contributors', {
        templateUrl: 'views/pages/contributors.html',
        controller: 'ContributorsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/contributors/:id', {
        templateUrl: 'views/pages/contributors.html',
        controller: 'ContributorsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/transmissions', {
        templateUrl: 'views/pages/transmissions.html',
        controller: 'TransmissionsCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/users', {
        templateUrl: 'views/pages/users.html',
        controller: 'UsersCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .when('/wizard', {
        templateUrl: 'views/pages/wizard.html',
        controller: 'WizardCtrl',
        resolve: { '_initData': ['_init', function(_init) { return _init.promise(true); }]}
      })
      .otherwise({
        redirectTo: '/dashboard'
      });

    $locationProvider.html5Mode(true);

  }]);
