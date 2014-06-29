'use strict';

angular.module('bmmLibApp')
  .filter('_protectedURL', ['_api', function (_api) {
    return function (path) {

      if (path.substring(0,4)!=='http') {
        path = _api.getserverUrli()+'file/protected/'+path;
      }

      return path;
    };
  }]);