'use strict';

angular.module('bmmLibApp')
  .filter('_authorizedUrl', function(_api){
    return function(url) {
      if (url && url.indexOf('auth=') == -1) {
        return _api.addAuthorizationQueryString(url);
      }

      return url;
    }
  });
