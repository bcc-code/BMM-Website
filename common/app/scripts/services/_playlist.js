'use strict';

angular.module('bmmLibApp')
  .factory('_playlist', [ function () {
    
    var factory = {},
        url='',
        tracks=[];

    factory.shuffle=false;
    factory.repeat=false;

    factory.setTracks = function(options) {

      //Required
      if (typeof options.tracks!=='undefined') {

        if (!$.isArray(options.tracks)) {
          options.tracks = [options.tracks];
        }

        tracks = options.tracks;

      } else {
        return false;
      }

      if (typeof options.index!=='undefined'&&
         (options.index>=0||options.index<tracks.length)) {
        factory.index = options.index;
      } else {
        factory.index = 0;
      }

      if (typeof options.url!=='undefined') {
        url = options.url;
      } else {
        url = false;
      }

    };

    factory.setShuffle = function(bool) {

      if (typeof bool!== 'undefined') {
        factory.shuffle = bool;
      } else {
        factory.shuffle = !factory.shuffle;
      }

      return factory.shuffle;

    };

    factory.setRepeat = function(bool) {
      if (typeof bool!== 'undefined') {
        factory.repeat = bool;
      } else {
        factory.repeat = !factory.repeat;
      }
      return factory.repeat;
    };

    factory.getUrl = function() {
      return url;
    };

    factory.getDuration = function() {

      //Required
      if (typeof tracks!=='undefined') {

        var duration=0;

        $.each(tracks, function() {
          duration+= this.duration;
        });

        return duration;

      } else {
        return false;
      }

    };

    factory.getCurrent = function() {
      if (tracks.length) {
        return tracks[factory.index];
      } else {
        return false;
      }
    };

    factory.updateCurrent = function(track) {
      if (tracks.length) {
        tracks[factory.index] = track;
      } else {
        return false;
      }
    };

    factory.getNext = function() {

      if (factory.shuffle) {
        factory.index = Math.floor(Math.random()*tracks.length);
        return factory.getCurrent();
      } else if (factory.index<(tracks.length-1)) {
        factory.index++;
        return factory.getCurrent();
      } else if (factory.repeat) {
        factory.index=0;
        return factory.getCurrent();
      } else {
        return false;
      }

    };

    factory.getPrevious = function() {

      if (factory.index>0) {
        factory.index--;
        return factory.getCurrent();
      } else if (factory.repeat) {
        factory.index=(tracks.length-1);
        return factory.getCurrent();
      } else {
        return false;
      }

    };

    factory.index = 0;

    return factory;
    
  }]);