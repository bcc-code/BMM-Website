'use strict';

angular.module('bmmLibApp')
  .factory('_locals', function ($http, $q, _api) {
    var factory = {},
        locals = {};
    locals.date = {};

    factory.fetchFiles = function(url, user) {

      var localsLoaded = $q.defer(), //Will be resolved at a later time
          folderLoaded = _api.root().done(function(root) {

        var promises = [];
        var expectedResponses = 1;
        var results = 0;

        var model = angular.fromJson(localStorage[user.username]) || {}, lang;
        if (typeof model.websiteLanguage !== 'undefined') {
          lang = model.websiteLanguage;
        } else {
          var contentLanguages = _api.getContentLanguages();
          lang = contentLanguages[0] ? contentLanguages[0] : "nb";
        }

        promises.push($http.get(url+lang+'.json')
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

      return $q.all([localsLoaded.promise]);
    };

    factory.getAll = function() {
      return locals;
    };

    return factory;

  });
