'use strict';

angular.module('bmmLibApp')
  .factory('init', ['$http', '$q', 'bmmApi', 'locals', function ($http, $q, bmmApi, locals) {

    var factory = {};

    //Common
    factory.user = {};
    factory.root = {};
    factory.translation = {};
    factory.mediaLanguage = 'nb'; //Fallback
    factory.ios = false;
    factory.locals = {};
    factory.load = {
      percent: 0,
      loaded: false,
      complete: $q.defer()
    };

    factory.promise = function(admin) {
      if (typeof admin==='undefined') {
        admin = false;
      }
      factory.authorize(admin);
      return factory.load.complete.promise;
    };

    //Admin only
    factory.titles = {};

    factory.authorize = function(admin) {

      if (factory.load.loaded) { return; }
      if (typeof admin==='undefined') { admin = false; }

      bmmApi.loginUser().done(function(user) {

        factory.load.percent+=20;
        var promises = [];

        // -- User
        factory.user = user;

        // -- Credentials
        bmmApi.setCredentials(user.username, user.token);

        // -- Root & Medialanguage (Depends on root)
        var rootLoaded = $q.defer(),
            mediaLanguageLoaded = $q.defer(),
            translationLoaded = $q.defer();
        promises.push(rootLoaded);
        promises.push(mediaLanguageLoaded);
        promises.push(translationLoaded);
        bmmApi.root().done(function(root) {
          //Temporary remove arabic (@todo - remove later)
          $.each(root.languages, function(index) {
            if (this==='ar') {
              root.languages.splice(index,1);
            }
          });
          factory.root = root;
          rootLoaded.resolve();
          factory.load.percent+=20;

          // -- Medialanguage
          findMediaLanguage(user.languages,0, mediaLanguageLoaded);

          // -- Translation
          findTranslation(user.languages,0, translationLoaded);
        });

        // -- IOS (iphone, ipod, ipad ?)
        var ipad = (navigator.userAgent.match(/iPad/i) !== null),
            iphone = (navigator.userAgent.match(/iPhone/i) !== null),
            ipod = (navigator.userAgent.match(/iPod/i) !== null);
        if (ipad||iphone||ipod) {
          factory.ios = true;
        }

        // -- Date locals
        factory.locals = locals.fetchFiles('translations/locals').then(function() {
          factory.load.percent+=5;
        });
        promises.push(factory.locals);

        if (admin) {
          // -- Album titles
          var titlesLoaded = $q.defer();
          promises.push(titlesLoaded);
          $.ajax({
            url: 'translations/titles/album.json',
            success: function(data) {
              factory.titles.album = data;
              titlesLoaded.resolve();
              factory.load.percent+=5;
            }
          });
        }

        $q.all(promises).then(function() {
          factory.load.complete.resolve();
          factory.load.loaded = true;
          factory.load.percent+=10;
        });

      }).fail(function() {
        bmmApi.loginRedirect();
      });

    };

    var findMediaLanguage = function(lang, index, promise) {
      if ($.inArray(lang[index],factory.root.languages)!==-1) {
        factory.mediaLanguage = lang[index];
        promise.resolve();
        factory.load.percent+=20;
      } else if (!bmmUser.mediaLanguageIsSet()) {
        findMediaLanguage(lang, index+1, promise);
      }
    };

    var findTranslation = function(lang, index, promise) {
      if (typeof lang[index]==='undefined') {
        lang[index] = 'nb'; //Fallback
      }

      $.ajax({
        url: 'translations/'+lang[index]+'.json',
        error: function() {
          findTranslation(lang, (index+1), promise);
        },
        success: function(data) {
          factory.translation = data;
          promise.resolve();
          factory.load.percent+=20;
        }
      });
    };

    return factory;
  }]);
