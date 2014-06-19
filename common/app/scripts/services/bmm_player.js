'use strict';

angular.module('bmmLibApp')
  .factory('bmmPlayer', ['bmmPlaylist', '$timeout', '$rootScope', '$filter', '$window', 'bmmApi', 'bmmFormatterTrack',
    function (bmmPlaylist, $timeout, $rootScope, $filter, $window, bmmApi, bmmFormatterTrack) {
  
  var factory = {},
      videoTarget,
      source;

  factory.currentTime = 0;
  factory.currentTimePercent = 0;
  factory.volume = .8;
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
  factory.playing = false;
  factory.trackSwitched = false;
  factory.videoFirst = true; //Show video if available

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
          // @analytics - Report track finnished to google analytics
          $window.ga('send', 'event', 'tracks', 'play end', factory.title, factory.id);

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

  factory.setPlay = function(time) {
    if (typeof time!=='undefined') {
      $(videoTarget).jPlayer('play', time);
    } else {
      $(videoTarget).jPlayer('play');
    }
    factory.playing = true;
  };

  factory.setPause = function(time) {
    if (typeof time!=='undefined') {
      $(videoTarget).jPlayer('pause', time);
    } else {
      $(videoTarget).jPlayer('pause');
    }
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

  factory.toggleVideoFirst = function() {
    factory.videoFirst = !factory.videoFirst;
    if (typeof factory.source!=='undefined' &&
        factory.source.video&&factory.source.audio) {
      factory.setSource(factory.source, factory.currentTime);
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

  factory.setSource = function(source, time) {

    if (typeof source!=='undefined') {

      var paused = $(videoTarget).data('jPlayer').status.paused;
      $(videoTarget).jPlayer('clearMedia');

      //Below is deprecated
      factory.cover = source.cover;
      factory.title = source.title;
      factory.subtitle = source.subtitle;
      factory.language = source.language;
      factory.id = source.id;
      factory.raw = source.raw;
      factory.formatted = bmmFormatterTrack.resolve(source.raw);

      // @analytics - Report track started playing to google analytics
      $window.ga('send', 'event', 'tracks', 'play start', factory.title, factory.id);

      //You should use this
      factory.source = source;

      var type, file, src;
      if ((source.video && source.audio && factory.videoFirst)||
          (source.video && !source.audio)) {
        src = factory.resolveTypes(source.videos, true);
        $(videoTarget).jPlayer('setMedia', src);
      } else if (source.audio) {
        src = factory.resolveTypes(source.audios);
        $(videoTarget).jPlayer('setMedia', src);
      } else if (source.unknown) {
        src = factory.resolveTypes(source.unknowns);
        $(videoTarget).jPlayer('setMedia', src);
      }

      if (!paused) {
        factory.setPlay(time);
      } else {
        factory.setPause(time);
      }

      factory.trackSwitched = !factory.trackSwitched;

    }

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

  //Convert mime_type from API to type from
  factory.resolveTypes = function(files, video) {

    if (typeof video==='undefined') {
      video = false;
    }

    var sourceReady = {
      poster: factory.cover
    };

    $.each(files, function() {

      switch(this.type) {
        case 'audio/mpeg':
          sourceReady.mp3 = this.file;
          factory.setAudio();
          break;
        case 'video/mp4':
          sourceReady.m4v = this.file;
          factory.setVideo();
          break;
        case 'application/ogg':
          if (video) {
            sourceReady.ogv = this.file;
            factory.setVideo();
          } else {
            sourceReady.oga = this.file;
            factory.setAudio();
          }
          break;
        case 'video/webm':
          sourceReady.webmv = this.file;
          factory.setVideo();
          break;
        case 'audio/webm':
          sourceReady.webma = this.file;
          factory.setAudio();
          break;
        default:
          sourceReady.mp3 = this.file;
          factory.setAudio();
          break;
      };

    });

    return sourceReady;

  };

  factory.setAudio = function() {
    factory.showVideo = false;
    factory.video = false;
    factory.setFullscreen(false);
  }

  factory.setVideo = function() {
    factory.showVideo = true;
    factory.video = true;
  }

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