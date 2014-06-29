'use strict';

angular.module('bmmLibApp')
  .factory('_init', ['$http', '$q', '$location', '_api', '_locals', function ($http, $q, $location, _api, _locals) {

    var factory = {},
        loginAttempts = 3;

    //Common
    factory.user = {};
    factory.admin = false;
    factory.root = {};
    factory.translation = {};
    factory.translations = {}; //Object with actual translations
    factory.translations.available = []; //Array with translations available
    factory.podcastLanguage = factory.websiteLanguage = factory.contentLanguage = 'nb'; //Fallback
    factory.isIOS = false;
    factory.config = {};
    factory.bible = {};
    factory.load = {
      percent: 0,
      progress: false,
      status: '',
      loaded: false,
      complete: $q.defer()
    };

    factory.promise = function(admin) {
      if (typeof admin==='undefined') { admin = false; }
      factory.authorize(admin);
      return factory.load.complete.promise;
    };

    //Admin only
    factory.titles = {};

    factory.authorize = function(admin, attempt) {

      // -- Check if authorization has been attempted earlier
      if (typeof attempt!=='undefined'&&attempt>loginAttempts) {
        return false;
      } else if (typeof attempt==='undefined') {
        attempt = 0;
      }

      if (factory.load.loaded) { return; }
      if (factory.load.progress) { return; }
      factory.load.progress = true;
      if (typeof admin==='undefined') { admin = false; }

      factory.load.status = 'Loading configuration';

      // -- Load configurations
      $http.get('scripts/config.json').success(function(config) {

        factory.config = config;
        _api.serverUrl(config.serverUrl);
        _api.setKeepAliveTime(config.keepAlive*1000);

        // -- Secure that the correct protocol given by configuration is used
        if ($location.protocol()!==config.protocol&&
            $location.port()!==config.developerPort) {
          var link = config.protocol+'://'+window.location.href.substr(5);
          link = link.replace('////','//'); //IE FIX
          window.location = link;
        }

        factory.load.status = 'Attempt to login';

        // -- Attempt to login
        _api.loginUser().done(function(user) {

          factory.load.percent+=20;
          var promises = [];

          // -- User
          factory.user = user;

          // -- Admin
          factory.admin = isAdmin(user.roles);

          // -- Credentials
          _api.setCredentials(user.username, user.token);

          // -- Root & contentLanguage (Depends on root)
          var rootLoaded = $q.defer(),
              contentLanguageLoaded = $q.defer(),
              translationLoaded = $q.defer();
          promises.push(rootLoaded.promise);
          promises.push(contentLanguageLoaded.promise);
          promises.push(translationLoaded.promise);

          factory.load.status = 'Fetching data';

          _api.root().done(function(root) {

            factory.load.status = 'Root loaded';

            //Temporary remove arabic (@todo - remove later)
            $.each(root.languages, function(index) {
              if (this==='ar') {
                root.languages.splice(index,1);
                return false;
              }
            });
            //Load all translations (Loads in background, not time dependent)
            $.each(factory.config.translationsAvailable, function() {
              var lang = this;
              $.ajax({
                url: factory.config.translationFolder+lang+'.json',
                success: function(data) {
                  factory.translations[lang] = data;
                  factory.translations.available.push(lang);
                }
              });
            });
            factory.root = root;
            rootLoaded.resolve();
            factory.load.percent+=20;

            // -- contentLanguage
            findcontentLanguage(user.languages,0, contentLanguageLoaded);

            // -- Translation
            findTranslation(user.languages,0, translationLoaded);

          });

          // -- isIOS (iphone, ipod, ipad ?)
          var ipad = (navigator.userAgent.match(/iPad/i) !== null),
              iphone = (navigator.userAgent.match(/iPhone/i) !== null),
              ipod = (navigator.userAgent.match(/iPod/i) !== null);
          if (ipad||iphone||ipod) {
            factory.isIOS = true;
          }

          // -- Date locals
          var localsLoaded = _locals.fetchFiles(config.localsPath).then(function() {
            factory.load.percent+=10;
          });
          promises.push(localsLoaded);

          if (admin) {
            // -- Album titles
            var titlesLoaded = $q.defer();
            promises.push(titlesLoaded.promise);
            $.ajax({
              url: config.titlesAlbum,
              success: function(data) {
                factory.titles.album = data;
                titlesLoaded.resolve();
              }
            });

            // -- Bibleverses
            var bibleLoaded = $q.defer();
            promises.push(bibleLoaded.promise);
            translationLoaded.promise.then(function() {
              findBible(factory.user.languages, 0, bibleLoaded);
            });
          }

          $q.all(promises).then(function() {
            factory.load.complete.resolve();
            factory.load.loaded = true;
            factory.load.progress = false;
            factory.load.percent+=10;
            factory.load.status = 'Loading complete';
          });

        }).fail(function() {

          if (attempt>=loginAttempts) {
            window.location = config.serverUrl+'login/redirect?redirect_to='+window.location;
          }

          _api.loginRedirect({
            done: function() {
              factory.load.progress = false;
              factory.authorize(admin, (attempt+1));
            },
            fail: function(signOn) {
              window.location = signOn;
            }
          });

        });
      }).error(function() {
        factory.load.progress = false;
        factory.authorize(admin, (attempt+1));
      });
    };

    var isAdmin = function(roles) {
      var isAdmin = false;
      $.each(roles, function() {
        if (this==='ROLE_ADMINISTRATOR') { isAdmin = true; }
      });
      return isAdmin;
    }

    var findcontentLanguage = function(lang, index, promise) {

      factory.load.status = 'Find contentLanguage';

      if (typeof lang[index]==='undefined') {
        promise.resolve(); //Using fallback
      } else if ($.inArray(lang[index],factory.root.languages)!==-1) {
        factory.podcastLanguage = factory.websiteLanguage = factory.contentLanguage = lang[index];
        promise.resolve();
        factory.load.percent+=20;
      } else {
        findcontentLanguage(lang, index+1, promise);
      }
    };

    var findTranslation = function(lang, index, promise) {

      factory.load.status = 'Fetch translation';

      //Fallback
      if (typeof lang[index]==='undefined'||lang.length<1) {
        if (lang[(index-1)]==='nb') {
          lang[index] = 'en'; //Second fallback
        } else {
          lang[index] = 'nb'; //First fallback
        }
      }

      //Attempt to fetch file
      $.ajax({
        url: factory.config.translationFolder+lang[index]+'.json',
        error: function() {
          findTranslation(lang, (index+1), promise);
        },
        success: function(data) {
          factory.translation = data;
          factory.translation['iso-639-1'] = lang[index];
          promise.resolve();
          factory.load.percent+=20;
        }
      });
    };

    var findBible = function(lang, index, promise) {

      factory.load.status = 'Fetch bible';

      if (typeof lang[index]==='undefined'||lang.length<1) {
        lang[index] = 'nb'; //Fallback
      }

      $.ajax({
        url: factory.config.biblePath+lang[index]+'.json',
        error: function() {
          findBible(lang, (index+1), promise);
        },
        success: function(data) {
          factory.bible = data;
          promise.resolve();
        }
      });
    };

    return factory;
  }]);