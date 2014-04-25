'use strict';

/**
 *  This modul is used for debugging the bmm Library
 *  All routing and server connection is configured here
 *  
 *  @module bmmDebug
 *  @requires ngResource
 *  @requires ngSanitize
 *  @requires ngRoute
 *  @requires bmmLibApp
 *  @requires ui.sortable
 *  @requires angularTreeview
 */

angular.module('bmmDebug', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'bmmLibApp',
  'ui.sortable',
  'ui.bootstrap',
  'angularTreeview'
]).run(['$route', 'bmmApi', function($route, bmmApi)  {

    //bmmApi.serverUrl('https://'+window.location.hostname+'/bmm/api/web/app.php/');
    
    /*bmmApi.user().done(function() {
    }).fail(function() {
      bmmApi.loginRedirect();
    });*/

    $route.reload();

  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/pages/directives.html',
        controller: 'MainCtrl'
      })
      .when('/bmm_main', {
        templateUrl: 'views/previews/bmm_main.html',
        controller: 'MainCtrl'
      })
      .when('/bmm_sliders', {
        templateUrl: 'views/previews/bmm_sliders.html',
        controller: 'MainCtrl'
      })
      .when('/bmm_api', {
        templateUrl: 'views/previews/bmm_api.html',
        controller: 'ApiCtrl'
      })
      .when('/bmm_player_controller', {
        templateUrl: 'views/previews/bmm_player_controller.html',
      })
      .when('/bmm_player_about', {
        templateUrl: 'views/previews/bmm_player_about.html',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
