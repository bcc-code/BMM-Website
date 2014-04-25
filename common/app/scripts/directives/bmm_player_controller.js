'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerController', ['$timeout', 'bmmUser', 'bmmPlayer', function ($timeout, bmmUser, bmmPlayer) {
    return {
      template: '<div bmm-video-container></div>'+
                '<div class="bmm-max-width">'+
                  '<div bmm-player-about title=""></div>'+
                  '<div class="bmm-player-buttons">'+
                    '<div class="bmm-player-clock" id="clock1">{{clock1 | bmmTime}}</div>'+
                    '<div bmm-player-mediaslider></div>'+
                    '<div class="bmm-player-clock" id="clock2">{{clock2 | bmmTime}}</div>'+
                    '<div bmm-player-maincontrollers></div>'+
                    '<div class="bmm-player-tools">'+
                      '<div bmm-track-tools></div>'+
                      '<div bmm-volume-controller></div>'+
                    '</div>'+
                  '</div>'+
                '</div>',
      compile : function() {
        return {
          pre : function(scope, element) {

            //DEFINITIONS
            var width, aboutWidth, clock1, clock2, target, buttons, repeat,
                mediaslider, shuffle, mainControllers, tools, about, volume,
                video, videoContainer, minified = false;

            var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
            if (iOS) {
              $('body').find('.bmm-track-download').css('display','none');
            }

            //PRESET
            element.addClass('bmm-player-controller');
            scope.clock1 = '00:00';
            scope.clock2 = '00:00';

            //INITIALIZE
            $timeout(function() {

              buttons = element.find('.bmm-player-buttons');
              repeat = element.find('.bmm-player-repeat');
              mediaslider = buttons.children('.bmm-player-mediaslider');
              shuffle = element.find('.bmm-player-shuffle');
              mainControllers = element.find('.bmm-player-maincontrollers');
              tools = element.find('.bmm-player-tools');
              about = element.find('.bmm-player-about');
              volume = element.find('.bmm-volume-controller');
              video = element.find('.bmm-player-video');
              videoContainer = element.find('.bmm-video-container');
              target = element.parent().find('.bmm-player-target');

              element.find('.bmm-player-clock').each(function(i) {
                if (i===0) { clock1 = $(this); } else { clock2 = $(this); }
              });

              aboutWidth = about.outerWidth();

              checkForChanges();
              $timeout(function() {
                resizeTarget();
              });

              //UPDATE MEDIASLIDER WHILE PLAYING
              $timeout(function() {

                scope.bmmPlayer = bmmPlayer;
                scope.$watch('bmmPlayer.getCurrentTimePercent', function(time) {
                  if (!mediaslider.children('.ui-slider-handle').hasClass('ui-state-active')) {
                    mediaslider.slider('value', time);
                  }
                  scope.clock1 = bmmPlayer.getCurrentTime;
                  scope.clock2 = (bmmPlayer.getDuration()-bmmPlayer.getCurrentTime);
                  checkForChanges();
                });

                mediaslider.slider({
                  slide: function(e, ui) {
                    bmmPlayer.setCurrentTime(ui.value);
                  }
                });

              });

              video.click(function() {
                toggleVideo();
              });

              var showVideo = function() {
                videoContainer.attr('active', 'true');
                bmmPlayer.showVideo = true;

                element.parent().find('.bmm-video-screen').show().css({
                  width: (bmmUser.getScreenHeight()-10)/(9/16),
                  height: bmmUser.getScreenHeight()-10,
                  top: 10
                });

                var topBarHeight = 32;

                target.animate({
                  height: element.parent().height()-
                          element.height()-
                          bmmUser.getScreenHeight()-topBarHeight

                }, 'fast');

                videoContainer.animate({
                  height: bmmUser.getScreenHeight()
                }, 'fast', function() {
                  $(window).trigger('resize');
                });
              };

              var hideVideo = function() {
                videoContainer.attr('active', 'false');
                bmmPlayer.showVideo = false;

                var topBarHeight = 32;

                target.animate({
                  height: element.parent().height()-(element.height()-bmmUser.getScreenHeight())-topBarHeight
                }, 'fast');

                videoContainer.animate({
                  height: 0
                }, 'fast', function() {
                  element.find('.bmm-video-screen').hide();
                  $(window).trigger('resize');
                });
              };

              var toggleVideo = function() {
                if (videoContainer.attr('active')==='true') {
                  hideVideo();
                } else {
                  showVideo();
                }
              };

              scope.$watch('bmmPlayer.showVideo', function(show) {
                if (videoContainer.attr('active')!=='true'&&show) {
                  showVideo();
                }
                if (videoContainer.attr('active')==='true'&&!show) {
                  hideVideo();
                }
              });

              scope.$watch('bmmPlayer.isVideo', function(is) {
                if (!is) {
                  hideVideo();
                }
              });

              scope.file = '';
              scope.$watch('bmmPlayer.source', function(file) {
                scope.file = file;
              });

            });

            //IF DIV DIMENSIONS CHANGE
            $(window).resize(function() {
              checkForChanges();
              $timeout(function() {
                resizeTarget();
              });
            });
            
            //CHANGE TARGET DIMENSIONS
            var resizeTarget = function() {

              var topBarHeight = 32;
              target.css({
                height: element.parent().outerHeight()-
                        element.outerHeight()-topBarHeight
              });

            };

            //CHANGE MEDIASLIDER WIDTH
            var setSliderWidth = function() {
              width=clock1.width()+clock2.width();
              width=buttons.width()-(width+(width/1.8));
              mediaslider.width(width).attr('length',width);
            };

            //CHECK FOR CHANGES TO PLAYER DIMENSIONS
            var checkForChanges = function() {

              //Check if 'player-about' should be minified and find size of slider
              if (buttons.width()<(aboutWidth*1.8)&&!minified) {
                minified=true;

                var minitimer;
                  
                about.addClass('bmm-minified');
                about.css({
                  padding: '.5em 0 0 .8em',
                  height: '',
                  float: 'none'
                });

                about.after('<div class="bmm-player-minitimer"></div>');
                minitimer = element.find('.bmm-player-minitimer');

                clock1.remove().appendTo(minitimer);
                minitimer.append('<div>&nbsp/&nbsp</div>');
                clock2.remove().appendTo(minitimer);

                minitimer.children().css('float', 'left');
                minitimer.css({
                  position: 'absolute',
                  top: '.5em',
                  right: '.8em'
                });

                mediaslider.css({
                  width: '',
                  float: 'none'
                });

              } else if (buttons.width()>=(aboutWidth*2.8)&&minified) {
                minified=false;
                
                //repeat.detach().insertBefore(mediaslider).css('float', '');
                clock1.detach().insertBefore(mediaslider).css('float', '');
                //shuffle.detach().insertAfter(mediaslider).css('float', '');
                clock2.detach().insertAfter(mediaslider).css('float', '');

                element.find('.bmm-player-minitimer').remove();
                mediaslider.css('float', '');

                about.removeClass('bmm-minified');
                about.css({
                  padding: '',
                  float: ''
                });

                mainControllers.detach().insertAfter(clock2);

                setSliderWidth();
              } else if (buttons.width()>=(aboutWidth*1.8)&&!minified) {
                setSliderWidth();
              }

            };

          }
        };
      }
    };
  }]);