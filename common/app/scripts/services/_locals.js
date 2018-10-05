'use strict';

angular.module('bmmLibApp')
  .factory('_locals', function ($http, $q, _api) {
    var factory = {},
        locals = {};
    locals.date = {};

    factory.fetchFiles = function(url, lang) {

      var localsLoaded = $q.defer(), //Will be resolved at a later time
          folderLoaded = _api.root().done(function(root) {

        var promises = [];

        promises.push($http.get(url+lang+'.json')
          .success(function(file) {
            if (typeof file.id!=='undefined'&&typeof file.date!=='undefined') {
              locals.date[file.id] = file.date;
            }
            localsLoaded.resolve();
          })
          .error(function() {
            localsLoaded.resolve();
          })
        );
      });

      return $q.all([localsLoaded.promise]);
    };

    factory.getAll = function() {
      return locals;
    };

    return factory;

  });
