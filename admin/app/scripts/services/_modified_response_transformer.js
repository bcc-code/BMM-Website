'use strict';

/// This service modifies the default implementation of defaultResponseTransformer to work-around a bug in angular-file-upload
angular.module('bmmLibApp').factory('_modifiedResponseTransformer', ['$http', function ($http) {

    var isString = function(value) {return typeof value === 'string';};
    var isJsonLike = function(str) {
        var jsonStart = str.match(JSON_START);
        return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
    };
    var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;
    var APPLICATION_JSON = 'application/json';
    var JSON_START = /^\[|^\{(?!\{)/;
    var JSON_ENDS = {
        '[': /]$/,
        '{': /}$/
    };
    var fromJson = function(json) {
        return isString(json)
          ? JSON.parse(json)
          : json;
    };

    $http.defaults.transformResponse[0] = function(data, headers) {
        if (isString(data)) {
            // Strip json vulnerability protection prefix and trim whitespace
            var tempData = data.replace(JSON_PROTECTION_PREFIX, '').trim();
        
            if (tempData) {
                if (!headers) {
                    // angular-file-upload has a bug that makes it pass a null header
                    // therefore we skip checking the headers if it comes from the file upload
                    if (isJsonLike(tempData)) {
                        data = fromJson(tempData);
                    }
                } else {
                    var contentType = headers('Content-Type');
                    if ((contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) || isJsonLike(tempData)) {
                        data = fromJson(tempData);
                    }
                }
            }
        }
    
        return data;
    };
    
    var factory = {};

    return factory;

  }]);