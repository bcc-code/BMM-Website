'use strict';

angular.module('bmmLibApp')
  .factory('locals', [ '$http', '$q', function ($http, $q) {
    var factory = {},
        locals = {};

    factory.fetchFiles = function(url) {
      var localsLoaded = $q.defer(), //Will be resolved at a later time
          folderLoaded = $http.get(url)
        .then(function(result) {
          var files = $(result.data).find('li > a:contains(.json)'),
              promises = [];
          files.each(function() {

            //List of locals properties
            locals.date = {};

            promises.push($http.get(url+'/'+$(this).attr('title'))
              .then(function(file) {
                if (typeof file.data.local!=='undefined'&&typeof file.data.date!=='undefined') {
                  locals.date[file.data.local] = file.data.date;
                }
              })
            );
            $q.all(promises).then(function() {
              localsLoaded.resolve();
            });
          });
        });
      return $q.all([folderLoaded, localsLoaded.promise]);
    };

    factory.date = function(date, lang) {
      return locals;
    };

    return factory;

  }]);
