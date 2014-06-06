'use strict';

angular.module('bmmLibApp')
  .directive('player', [ '$timeout', '$compile', 'bmmPlayer', 'bmmPlaylist',
  function ($timeout, $compile, bmmPlayer, bmmPlaylist) {
    return {
      link: function postLink(scope, element) {

        bmmPlayer.initialize('.video-target');
        scope.player = bmmPlayer;
        scope.playlist = bmmPlaylist;

        //Fullscreen controllers HTML
        element.find('.video-target').append($compile(
          '<div class="fullscreen-controllers" ng-show="player.fullscreen">' +
            '<div class="previous" ng-click="player.setPrevious();"></div>' +
            '<div class="play" ng-class="{\'pause\': player.playing}" ng-click="togglePlay();"></div>' +
            '<div class="next" ng-click="player.setNext();"></div>' +
            '<div class="duration">' +
              '{{player.currentTime | bmmTime}} / ' +
              '{{(player.getDuration()-player.currentTime) | bmmTime}}' +
            '</div>' +
            '<div class="fullscreen-toggle"></div>' +
            '<div class="mute" ng-hide="ios" ng-class="{\'active\': player.muted}" ng-click="player.setMute();"></div>' +
            '<div class="volume" ng-hide="ios"></div>' +
            '<div class="slider"><div class="target"></div></div>' +
          '</div>')
        (scope));

        //Main media navigator slider
        var trackSlider = element.find('.target');
        trackSlider.slider({
          step: .25,
          create: function() {
            $(this).append('<div class="behind"></div>');
          },
          slide: function(e, ui) {
            trackSlider.find('.behind').css({ width: (100-ui.value)+'%' });
            scope.player.setCurrentTime(ui.value);
          },
          change: function(e, ui) {
            trackSlider.find('.behind').css({ width: (100-ui.value)+'%' });
          }
        });

        //Update slider and time display while playing
        scope.$watch('player.currentTimePercent', function(time) {
          if (!trackSlider.children('.ui-slider-handle').hasClass('ui-state-active')) {
            trackSlider.slider('value', time);
          }
        });

        //Toggle play
        scope.togglePlay= function() {
          if (scope.player.playing) {
            scope.player.setPause();
          } else {
            scope.player.setPlay();
          }
        };

        //Volume slider
        var volumeSlider = element.find('.volume');
        volumeSlider.slider({
          create: function() {
            $(this).append('<div class="behind"></div>');
          },
          slide: function(e, ui) {
            volumeSlider.find('.behind').css({ width: (100-ui.value)+'%' });
            scope.player.setVolume((ui.value/100));
          },
          change: function(e, ui) {
            volumeSlider.find('.behind').css({ width: (100-ui.value)+'%' });
          }
        });

        //Update volumeslider on volume change
        scope.$watch('player.volume', function(volume) {
          if (!volumeSlider.children('.ui-slider-handle').hasClass('ui-state-active')) {
            volumeSlider.slider('value', (volume*100));
          }
        });

        //Resizeable display
        element.find('.videoscreen').resizable({
          handles: 'n',
          minHeight: 100,
          resize: function() {
            $(this).css('top','auto');
            $(this).find('.display').width($(this).height()*(16/9));
            $('[navigator]').css({
              marginBottom: $(this).outerHeight()
            });
            $('[ng-view]').css({
              marginBottom: element.outerHeight()+$(this).outerHeight()
            });
          }
        });

        //Hide / show display
        scope.$watch('player.showVideo', function(on) {
          if (on) {
            $timeout(function() {
              element.find('.videoscreen').css('top','auto');
              element.find('.display').width(element.find('.videoscreen').height()*(16/9));
              $('[navigator]').css({
                marginBottom: element.find('.videoscreen').outerHeight()
              });
              $('[ng-view]').css({
                marginBottom: element.outerHeight()+element.find('.videoscreen').outerHeight()
              });
            }, 301); //Must fire after transistion() from css [.3s]
          } else {
            $('[navigator]').css({
              marginBottom: ''
            });
            $('[ng-view]').css({
              marginBottom: ''
            });
          }
        });

        //Fadeout timer for fullscreen toggle (this button exist also in normal mode) & fullscreen controllers
        var timer = $timeout(function() {
          element.find('.fullscreen-toggle').addClass('unvisible');
          element.find('.fullscreen-controllers').addClass('unvisible');
          $('body').css('cursor', 'none');
        },4000);

        $(window).on('mousemove click', function() {
          element.find('.fullscreen-toggle').removeClass('unvisible');
          element.find('.fullscreen-controllers').removeClass('unvisible');
          $('body').css('cursor', 'auto');
          $timeout.cancel( timer );
          timer = $timeout(function() {
            element.find('.fullscreen-toggle').addClass('unvisible');
            element.find('.fullscreen-controllers').addClass('unvisible');
            $('body').css('cursor', 'none');
          },4000);
        });
        element.find('.fullscreen-toggle').click(function() {
          bmmPlayer.setFullscreen();
        });

      }
    };
  }]);