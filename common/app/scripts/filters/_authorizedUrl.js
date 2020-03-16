'use strict';

angular.module('bmmLibApp')
  .filter('_authorizedUrl', function(_api){
    return function(url) {
      var prefix_url = _api.getserverUrli() + "file/protected/";
      if (url && url.indexOf(prefix_url) !== -1 && url.indexOf('auth=') == -1) {
        var divider = url.indexOf('?') == -1 ? '?':'&';
        url = url + divider + _api.getAuthorizationQueryString();
      }

      return url;
    }
  });