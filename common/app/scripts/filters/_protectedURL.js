'use strict';

angular.module('bmmLibApp')
  .filter('_protectedURL', function (_api) {
    return function (path) {
      return _api.addAuthorizationQueryString(_api.getFileServerUrl() + path);
    };
  });
