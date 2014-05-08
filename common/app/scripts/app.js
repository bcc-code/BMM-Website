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
        templateUrl: 'views/pages/frontend.html',
        controller: 'MainCtrl'
      })
      .when('/backend', {
        templateUrl: 'views/pages/backend.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
