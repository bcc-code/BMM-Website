'use strict';

angular.module('bmmLibApp')
  .filter('_languageCode', function () {
    return function (lang) {

      var languageNames = {
        nb: 'Norsk',
        da: 'Dansk',
        af: 'Afrikaans',
        bg: 'Български език',
        cs: 'Čeština',
        de: 'Deutsch',
        en: 'English',
        et: 'eesti',
        el: 'ελληνικά',
        es: 'Español',
        fi: 'Suomi',
        fr: 'Français',
        hr: 'Hrvatski',
        hu: 'Magyar',
        it: 'Italiano',
        ml: 'മലയാളം (Malayalam)',
        nl: 'Nederlands',
        pl: 'Polski',
        pt: 'Português',
        ro: 'Română',
        ru: 'Русский язык',
        ta: 'தமிழ் (Tamil)',
        tr: 'Türkçe',
        uk: 'Українська',
        zh: '中文',
        he: 'עברית',
        sl: 'slovenščina',
        yue: '廣東話',
        kha: 'Khasi',
        zxx: 'Unknown'
      };

      if (typeof languageNames[lang]!=='undefined') {
        return languageNames[lang];
      } else {
        return lang;
      }

    };
  });
