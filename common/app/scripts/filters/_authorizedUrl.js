'use strict';

angular.module('bmmLibApp')
  .filter('_authorizedUrl', function(_api){
    return function(url) {
      var prefix_url = _api.getserverUrli() + "file/protected/";
      if (url && url.indexOf(prefix_url) !== -1 && url.indexOf('auth=') == -1) {
        return _api.addAuthorizationQueryString(url);
      }

      return url;
    }
  });