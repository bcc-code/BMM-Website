'use strict';

angular.module('bmmLibApp')
  .factory('_session', function () {
  
  var factory = {};
  var fallbackSession = {

  };
  factory.current = {};

  factory.restoreSession = function(username, fallbackLanguages) {
    var model = angular.fromJson(localStorage[username]);
    if (typeof model!=='undefined') {
           
      // We changed the language code for Danish and this makes it backwards compatible for users that have the setting stored in the localStorage. After a few months we can remove it.
      if (model.websiteLanguage == "dk") { model.websiteLanguage = "da"; }

      factory.current = model;
      console.log('session has been restored successfully');
    } else {
        var fallbackSession = {
            contentLanguages: fallbackLanguages,
            websiteLanguage: fallbackLanguages[0],
            videoFirst: true
        };
        factory.current = fallbackSession;
    }
  };

  window.session = factory;

  return factory;

});