'use strict';

angular.module('bmmLibApp')
  .filter('bmmFilePath', ['bmmApi', function (bmmApi) {
    return function (path) {

      //Used to secure file before playing track in admin -> track controller

      if (path.substring(0,4)!=='http') {
        path = bmmApi.getserverUrli()+'file/protected/'+path;
      }

      path = path;

      return path;
    };
  }]);