'use strict';

angular.module('bmmLibApp')
  .directive('bmmVideoFullscreen', ['bmmPlayer', '$timeout', function (bmmPlayer, $timeout) {
    return {
      template: '<div class="bmm-video-fullscreen-buttons">'+
                  '<div bmm-player-previous></div>'+
                  '<div bmm-player-play></div>'+
                  '<div bmm-player-next></div>'+
                  '<p>{{clock1 | bmmTime}} / {{clock2 | bmmTime}}</p>'+
                  '<div bmm-volume-controller></div>'+
                '</div>'+
                '<div class="bmm-video-fullscreen-slider">'+
                  '<div bmm-player-mediaslider></div>'+
                '</div>',
      compile : function() {
        return {
          pre : function(scope, element) {

            //PRESET
            element.addClass('bmm-video-fullscreen');
            element.addClass('hide');

            var timer = $timeout(function() {
              element.fadeOut('slow');
            },2000);

            $(window).on('mousemove click', function() {
              element.show();
              $timeout.cancel( timer );
              timer = $timeout(function() {
                element.fadeOut('slow');
              },2000);
            });

            var mediaslider;

            //UPDATE MEDIASLIDER WHILE PLAYING
            $timeout(function() {
              $timeout(function() {

                mediaslider = element.find('.bmm-video-fullscreen-slider')
                .find('.bmm-player-mediaslider');

                scope.bmmPlayer = bmmPlayer;
                scope.$watch('bmmPlayer.getCurrentTimePercent', function(time) {
                  if (!mediaslider.children('.ui-slider-handle').hasClass('ui-state-active')) {
                    mediaslider.slider('value', time);
                  }
                  scope.clock1 = bmmPlayer.getCurrentTime;
                  scope.clock2 = (bmmPlayer.getDuration()-bmmPlayer.getCurrentTime);
                });
              
                mediaslider.slider({
                  slide: function(e, ui) {
                    bmmPlayer.setCurrentTime(ui.value);
                  }
                });

                scope.$watch('bmmPlayer.getFullscreen', function(state) {
                  if (state==='on') {
                    element.removeClass('hide');
                  } else {
                    element.addClass('hide');
                  }
                });

              });
            });
            
          }
        };
      }
    };
  }]);