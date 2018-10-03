'use strict';

angular.module('bmmLibApp')
  .factory('_session', function (
    $rootScope,
    _locals
  ) {
  
  var factory = {};
  var fallbackSession = {

  };
  factory.current = {};

  factory.saveSession = function(username, videoFirst, welcomeMessages) {
    localStorage[username] = angular.toJson({
      contentLanguages: factory.current.contentLanguages,
      websiteLanguage: factory.current.websiteLanguage,
      videoFirst: videoFirst,
      welcomeMessages: welcomeMessages
    });
  };

  factory.restoreSession = function(username, fallbackLanguages) {
    var model = angular.fromJson(localStorage[username]);
    if (typeof model!=='undefined') {
           
      // We changed the language code for Danish and this makes it backwards compatible for users that have the setting stored in the localStorage. After a few months we can remove it.
      if (model.websiteLanguage == "dk") { model.websiteLanguage = "da"; }

      factory.current = model;
    } else {
        var fallbackSession = {
            contentLanguages: fallbackLanguages,
            websiteLanguage: fallbackLanguages[0],
            videoFirst: true
        };
        factory.current = fallbackSession;
    }
  };

  factory.fetchTranslationIfNeeded = function(lang, _init, action) {
    if(!_init.translations.hasOwnProperty(lang)) {
        $.ajax({
          url: _init.config.translationFolder + lang + '.json',
          success: function(data) {
            $rootScope.$apply(function() {
              _init.translations[lang] = data;
              action();
            });
          }
        }).then(function(){
          _locals.fetchFiles(_init.config.localsPath, lang);
        });
    } else {
      action();
    }
  };

  factory.setWebsiteLanguage = function(lang, _init, welcomeMessages = factory.current.welcomeMessages) {
    factory.fetchTranslationIfNeeded(lang, _init, function() {
      factory.current.websiteLanguage = lang;
      $rootScope.init.translation = _init.translation = _init.translations[lang];
      factory.saveSession(_init.user.username, factory.current.videoFirst, welcomeMessages);
    });
  };

  window.session = factory;

  return factory;

});