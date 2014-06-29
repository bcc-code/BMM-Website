'use strict';

angular.module('bmmLibApp')
  .filter('_protectedURL', ['_api', function (_api) {
    return function (path) {

      //Used to secure file before playing track in admin -> track controller

      if (path.substring(0,4)!=='http') {
        path = _api.getserverUrli()+'file/protected/'+path;
      }

      path = path;

      return path;
    };
  }]);