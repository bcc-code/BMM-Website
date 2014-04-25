'use strict';

angular.module('bmmLibApp')
  .factory('bmmTranslator', function () {
    
    var factory = {}, translation = {}, bibleTranslation = {};

    factory.set = function(t) {
      translation = t;
    };

    factory.get = function() {
      return translation;
    };

    factory.setBible = function(t) {
      bibleTranslation = t;
    };

    factory.getBible = function() {
      return bibleTranslation;
    };

    return factory;

  });
