'use strict';

angular.module('bmmLibApp')
  .factory('bmmPlayer', ['bmmPlaylist', '$timeout', '$rootScope', '$filter', 'bmmApi', 'bmmFormatterTrack',
    function (bmmPlaylist, $timeout, $rootScope, $filter, bmmApi, bmmFormatterTrack) {
  
  var factory = {},
      videoTarget,
      source;

  factory.currentTime = 0;
  factory.currentTimePercent = 0;
  factory.volume = 0;
  factory.muted = false;
  factory.cover = '';
  factory.title = '';
  factory.subtitle = '';
  factory.extraTitle = '';
  factory.raw = {};
  factory.formatted = {};
  factory.id = -1;
  factory.fullscreen = false;
  factory.showVideo = false;
  factory.video = false;
  factory.source = '';
  factory.playing = false;
  factory.trackSwitched = false;

  factory.initialize = function(target) {

    if (typeof target!=='undefined') {
      videoTarget = target;
    }

    if (typeof videoTarget!=='undefined') {

      $(videoTarget).jPlayer({
        ready: function(e) {
          //Initialization complete
          factory.setSource(bmmPlaylist.getCurrent());
          factory.volume = e.jPlayer.options.volume;
        },
        swfPath: 'bower_components/jplayer/jquery.jplayer/Jplayer.swf',
        supplied: 'm4v, mp3',
        seeking: function() {
          //Seeking
        },
        seeked: function() {
          //Finished seeking
        },
        canplay: function() {
          //Buffer 'complete'
        },
        timeupdate: function() {
          //Track step
          $rootScope.safeApply(function() {
            factory.currentTime =
              $(videoTarget).data('jPlayer').status.currentTime;
            factory.currentTimePercent =
              $(videoTarget).data('jPlayer').status.currentPercentAbsolute;
          });
        },
        ended: function() {
          //End of track
          factory.setNext(true);
        },
        resize: function() {
          //Fullscreen was toggled
          $rootScope.$apply(function() {
            factory.fullscreen = !factory.fullscreen;
          });
        },
        size: {
          width: '100%',
          height: '100%'
        }
      });

    }

  };

  factory.setPlay = function() {
    $(videoTarget).jPlayer('play');
    factory.playing = true;
  };

  factory.setPause = function() {
    $(videoTarget).jPlayer('pause');
    factory.playing = false;
  };

  factory.setStop = function() {
    $(videoTarget).jPlayer('stop');
    factory.playing = false;
  };

  factory.setNext = function(play) {
    var src = bmmPlaylist.getNext();
    if (src!==false) {
      factory.setSource(src);
      if (typeof play!=='undefined'&&play) {
        factory.setPlay();
      }
    }
  };

  factory.setPrevious = function() {
    var src = bmmPlaylist.getPrevious();
    if (src!==false) {
      factory.setSource(src);
    }
  };

  factory.setMute = function(bool) {
    if (typeof bool!=='undefined') {
      if (bool) {
        $(videoTarget).jPlayer('mute');
        factory.muted = true;
      } else {
        $(videoTarget).jPlayer('unmute');
        factory.muted = false;
      }
      
    } else {
      if ($(videoTarget).data('jPlayer').options.muted) {
        $(videoTarget).jPlayer('unmute');
        factory.muted = false;
      } else {
        $(videoTarget).jPlayer('mute');
        factory.muted = true;
      }
    }
  };

  factory.setFullscreen = function(bool) {
    if (typeof bool!=='undefined') {
      $(videoTarget).jPlayer({ fullScreen: bool });
    } else {
      bool = !factory.fullscreen;
    }
    $(videoTarget).jPlayer({ fullScreen: bool });
    return bool;
  };

  factory.setVolume = function(volume) {
    $(videoTarget).jPlayer('volume', volume);
    factory.volume = volume;
  };

  factory.setSource = function(track) {

    $(videoTarget).jPlayer('clearMedia');

    var paused = $(videoTarget).data('jPlayer').status.paused;
    source = track;

    factory.cover = track.cover;
    factory.title = track.title;
    factory.subtitle = track.subtitle;
    factory.language = track.language;
    factory.id = track.id;
    factory.source = source.url;
    factory.raw = track.raw;
    factory.formatted = bmmFormatterTrack.resolve(track.raw);

    if (source.video) {
      $(videoTarget).jPlayer('setMedia', {
        m4v: source.url,
        poster: factory.cover
      });
      factory.showVideo = true;
      factory.video = true;
    } else {
      $(videoTarget).jPlayer('setMedia', {
        mp3: source.url,
        poster: factory.cover
      });
      factory.showVideo = false;
      factory.video = false;
      factory.setFullscreen(false);
    }

    if (!paused) {
      factory.setPlay();
    }

    factory.trackSwitched = !factory.trackSwitched;

  };

  factory.changeLanguage = function(lang) {

    if (factory.playing) {
      $(videoTarget).jPlayer('pause');
    };

    bmmApi.trackGet(factory.id, lang).done(function(track) {

      track = bmmFormatterTrack.resolve(track);

      var video = false;
      if (this.type==='video') {
        video = true;
      }

      var title = track.title;
      var performers = track.performers;
      if (track.subtype==='speech') {
        title = track.performers;
        performers = track.title;
      }

      var newTrack = {
        id: track.id,
        title: title,
        subtitle: performers,
        language: track.language,
        cover: $filter('bmmCover')(track.cover,track.subtype),
        url: track.file,
        duration: track.duration,
        video: video,
        raw: track.raw
      };

      $rootScope.$apply(function(){
        bmmPlaylist.updateCurrent(newTrack);
        factory.setSource(newTrack);
      });

      if (factory.playing) {
        $(videoTarget).jPlayer('play');
      };

    });
  };

  factory.setCurrentTime = function(value) {
    $(videoTarget).jPlayer('playHead', value);
  };

  factory.getDuration = function() {
    return $(videoTarget).data('jPlayer').status.duration;
  };

  $rootScope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase === '$apply' || phase === '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  return factory;

}]);