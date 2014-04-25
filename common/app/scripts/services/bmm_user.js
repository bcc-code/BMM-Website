'use strict';

angular.module('bmmLibApp')
  .factory('bmmUser', [function () {

    var factory = {},
        video = {},
        user = {},
        currentNavigator = 'main', //Options ['main', 'playlist']
        displayNavigator = true,
        mediaLanguageIsSet = false,
        translation = {},
        tagTranslation = {},
        username; //Deprecated - use user instead

    video.screen = {};
    video.screen.height = '180';
    video.screen.width = '180';

    factory.getScreenWidth = function() {
      return video.screen.width;
    };

    factory.getScreenHeight = function() {
      return video.screen.height;
    };

    factory.getCurrentNavigator = function() {
      return currentNavigator;
    };

    factory.setScreenWidth = function(width) {
      video.screen.width = width;
    };

    factory.setScreenHeight = function(height) {
      video.screen.height = height;
    };

    factory.setCurrentNavigator = function(nav) {
      currentNavigator = nav;
    };

    factory.displayNavigator = function(display) {
      
      if (typeof display!=='undefined') {
        displayNavigator = display;
      }

      return displayNavigator;

    };

    factory.mediaLanguage = 'nb'; //Fallbacklanguage
    
    factory.setMediaLanguage = function(lang) {
      mediaLanguageIsSet = true;
      factory.mediaLanguage = lang;
    };

    factory.mediaLanguageIsSet = function() {
      return mediaLanguageIsSet;
    };

    factory.setTranslation = function(lang) {
      translation = lang;
    };

    factory.getTranslation = function() {
      return translation;
    };

    factory.setTagTranslation = function(file) {
      tagTranslation = file;
    };

    factory.getTagTranslation = function() {
      return tagTranslation;
    };

    //Deprecated - use setUser instead
    factory.setUsername = function(name) {
      username = name;
    };

    //Deprecated - use getUser instead
    factory.getUsername = function() {
      return username;
    };

    factory.setUser = function(_user) {
      user = _user;
    };

    factory.getUser = function() {
      return user;
    };

    return factory;

  }]);
