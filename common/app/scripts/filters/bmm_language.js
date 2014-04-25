'use strict';

angular.module('bmmLibApp')
  .filter('bmmLanguage', function () {
    return function (lang) {

      var languageNames = {
        nb: 'Norsk',
        af: 'Afrikaans',
        bg: 'Български език',
        cs: 'Čeština',
        de: 'Deutsch',
        en: 'English',
        es: 'Español',
        fi: 'Suomi',
        fr: 'Français',
        hr: 'Hrvatski',
        hu: 'Magyar',
        it: 'Italiano',
        nl: 'Nederlands',
        pl: 'Polski',
        pt: 'Português',
        ro: 'Română',
        ru: 'Русский язык',
        tr: 'Türkçe',
        zh: '中文',
        zxx: 'Unknown'
      };

      if (typeof languageNames[lang]!=='undefined') {
        return languageNames[lang];
      } else {
        return lang;
      }

    };
  });