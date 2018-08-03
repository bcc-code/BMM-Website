'use strict';

angular.module('bmmLibApp')
  .factory('_player', function ($timeout, $rootScope, $filter, $window, $analytics, _api, _playlist,  _track) {
  
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
          factory.setSource(_playlist.getCurrent());
          factory.volume = e.jPlayer.options.volume;
        },
        swfPath: 'bower_components/jplayer/jquery.jplayer/Jplayer.swf',
        supplied: 'webmv, m4v, oga, mp3', //oga suports opus
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
          $analytics.eventTrack('play end', {
            category: 'tracks',
            label: factory.title,
            value: factory.id
          });

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

  //Keyboard shortcuts
  $(document).keydown(function(e){
    if(!$("input,textarea").is(":focus")){
      switch(e.keyCode) {
        case 32: //Space
          e.preventDefault();
          factory.togglePlay();
          break;
        case 37: //Left arrow
          e.preventDefault();
          factory.setPrevious();
          break;
        case 39: //Right arrow
          e.preventDefault();
          factory.setNext();
          break;
        case 77: //m
          e.preventDefault();
          factory.setMute();
          break;
        case 70: //f
          if (factory.video) {
            e.preventDefault();
            factory.setFullscreen();
          }
          break;
        case 82: //r
          e.preventDefault();
          _playlist.setRepeat();
          break;
        case 83: //s
          e.preventDefault();
          _playlist.setShuffle();
          break;
        case 107: //+
          e.preventDefault();
          if (factory.volume+.1>1) {
            factory.setVolume(1);
          } else {
            factory.setVolume(factory.volume+.1);
          }
          break;
        case 109: //-
          e.preventDefault();
          if (factory.volume-.1<0) {
            factory.setVolume(0);
          } else {
            factory.setVolume(factory.volume-.1);
          }
          break;
      }
    }
  });

  factory.togglePlay = function() {
    if (factory.playing) {
      factory.setPause();
    } else {
      factory.setPlay();
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
    var src = _playlist.getNext();
    if (src!==false) {
      factory.setSource(src);
      if (typeof play!=='undefined'&&play) {
        factory.setPlay();
      }
    }
  };

  factory.setPrevious = function() {
    var src = _playlist.getPrevious();
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
      factory.formatted = _track.resolve(source.raw);

      if (typeof time==='undefined') {
        if (typeof source.timestamp!=='undefined') {
          time = source.timestamp;
        } else {
          time = 0;
        }
      }
      $analytics.eventTrack('play start', {
        category: 'tracks',
        label: factory.title,
        value: factory.id
      });

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

    var playOnLoad = false, time = factory.currentTime;

    if (factory.playing) {
      factory.setPause();
      playOnLoad = true;
    };

    // We want to avoid caching, so we send the timestamp in the options
    _api.trackGet(factory.id, {timestamp: new Date()}, lang).done(function(track) {

      track = _track.resolve(track);

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
        cover: $filter('_cover')(track.cover,track.subtype),
        duration: track.duration,
        audios: track.audios,
        videos: track.videos,
        unknowns: track.unknowns,
        audio: track.audio,
        video: track.video,
        unknown: track.unknown,
        raw: track.raw,
        timestamp: time
      };

      $rootScope.$apply(function(){
        _playlist.updateCurrent(newTrack);
        factory.setSource(newTrack, time);
      });

      if (playOnLoad) {
        factory.setPlay(time);
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

});