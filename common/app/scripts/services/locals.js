'use strict';

angular.module('bmmLibApp')
  .factory('locals', [ '$http', '$q', 'bmmApi', function ($http, $q, bmmApi) {
    var factory = {},
        locals = {};
    locals.date = {};

    factory.fetchFiles = function(url) {

      var localsLoaded = $q.defer(), //Will be resolved at a later time
          folderLoaded = bmmApi.root().done(function(root) {

        var promises = [];
        var expectedResponses = root.languages.length;
        var results = 1;

        $.each(root.languages, function() {
          promises.push($http.get(url+this+'.json')
            .success(function(file) {
              if (typeof file.id!=='undefined'&&typeof file.date!=='undefined') {
                locals.date[file.id] = file.date;
              }
              results++;
              if (results>=expectedResponses) {
                localsLoaded.resolve();
              }
            })
            .error(function() {
              results++;
              if (results>=expectedResponses) {
                localsLoaded.resolve();
              }
            })
          );
        });

      });

      return $q.all([localsLoaded.promise]);
    };

    factory.getAll = function() {
      return locals;
    };

    return factory;

  }]);
