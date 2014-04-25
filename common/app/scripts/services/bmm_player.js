'use strict';

angular.module('bmmLibApp')
  .factory('bmmPlayer', ['bmmPlaylist', '$timeout', '$rootScope', function (bmmPlaylist, $timeout, $rootScope) {
  
  var factory = {},
      videoTarget,
      source;

  factory.initialize = function(target) {

    if (typeof target!=='undefined') {
      videoTarget = target;
    }

    if (typeof videoTarget!=='undefined') {

      $(videoTarget).jPlayer({
        ready: function(e) {
          //Initialization complete
          factory.setSource(bmmPlaylist.getCurrent());
          factory.getVolume = e.jPlayer.options.volume;
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
            factory.getCurrentTime = $(videoTarget).data('jPlayer').
                                     status.currentTime;
            factory.getCurrentTimePercent = $(videoTarget).data('jPlayer').
                                            status.currentPercentAbsolute;
          });
        },
        ended: function() {
          //End of track
          factory.setNext(true);
        },
        resize: function() {
          //Fullscreen was toggled
          $rootScope.$apply(function() {
            if (factory.getFullscreen==='off') {
              factory.getFullscreen='on';
            } else {
              factory.getFullscreen='off';
            }
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
    //$rootScope.$apply(function() {
    factory.getPlaying = true;
    //});
  };

  factory.setPause = function() {
    $(videoTarget).jPlayer('pause');
    //$rootScope.$apply(function() {
    factory.getPlaying = false;
    //});
  };

  factory.setStop = function() {
    $(videoTarget).jPlayer('stop');
    //$rootScope.$apply(function() {
    factory.getPlaying = false;
    //});
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
      } else {
        $(videoTarget).jPlayer('unmute');
      }
      
    } else {
      if ($(videoTarget).data('jPlayer').options.muted) {
        $(videoTarget).jPlayer('unmute');
      } else {
        $(videoTarget).jPlayer('mute');
      }
    }
  };

  factory.setFullscreen = function(bool) {
    if (typeof bool!=='undefined') {
      $(videoTarget).jPlayer({ fullScreen: bool });
    } else {

      if (factory.getFullscreen==='off') {
        bool = true;
      } else {
        bool = false;
      }
      
    }
    $(videoTarget).jPlayer({ fullScreen: bool });
    return bool;
  };

  factory.setVolume = function(volume) {
    $(videoTarget).jPlayer('volume', volume);
    factory.getVolume = volume;
  };

  factory.setSource = function(track) {

    var paused = $(videoTarget).data('jPlayer').status.paused;
    source = track;

    factory.getCover = track.cover;
    factory.getTitle = track.title;
    factory.getSubtitle = track.subtitle;
    factory.getExtra = track.extra;
    factory.getId = track.id;
    factory.source = source.url;

    if (source.video) {
      $(videoTarget).jPlayer('setMedia', {
        m4v: source.url,
        poster: factory.getCover
      });
      factory.showVideo = true;
      factory.isVideo = true;
    } else {
      $(videoTarget).jPlayer('setMedia', {
        mp3: source.url,
        poster: factory.getCover
      });
      factory.showVideo = false;
      factory.isVideo = false;
      factory.setFullscreen(false);
    }

    if (!paused) {
      factory.setPlay();
    }

    factory.getTrackCount++;

  };

  factory.setCurrentTime = function(value) {
    $(videoTarget).jPlayer('playHead', value);
  };

  factory.getDuration = function() {
    return $(videoTarget).data('jPlayer').status.duration;
  };

  factory.getCurrentTime = 0;
  factory.getCurrentTimePercent = 0;
  factory.getVolume = 0;
  factory.getCover = '';
  factory.getTitle = '';
  factory.getSubtitle = '';
  factory.getExtra = '';
  factory.getId = -1;
  factory.getFullscreen = 'off';
  factory.showVideo = false;
  factory.isVideo = false;
  factory.source = '';
  factory.getPlaying = false;
  factory.getTrackCount = 0; //Checked by playlists (updates current playing track)

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