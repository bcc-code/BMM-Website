'use strict';

angular.module('bmmLibApp')
  .directive('bmmSliderVideo', ['$timeout', function ($timeout) {
    return {
      link: function postLink(scope, element) {

        element.addClass('bmm-slider-video');
        element.append('<div class="bmm-slider-video-prev"></div>');
        element.append('<div class="bmm-slider-video-next"></div>');

        var videos = element.find('.bmm-videos'),
            btnLeft = element.find('.bmm-slider-video-prev'),
            btnRight = element.find('.bmm-slider-video-next');

        var active;

        var initialize = function() {

          if (videos.children().length) {

            active = videos.find('>:nth-child(1)');

            videos.children().each(function() {
              $(this).zIndex(0);
            });

            //APPLY POSITION TO VIDEOS IN DIRECTIVE
            if (videos.children().length>2) {
              videos.children().last().zIndex(2).addClass('left');
            }

            active.zIndex(3).addClass('middle');

            if (videos.children().length>1) {
              active.next().zIndex(2).addClass('right');
            }

          } else {

            $timeout(function() {
              initialize();
            }, 500);

          }

        };

        initialize();

        //SLIDE FUNCTIONALITY
        btnRight.click(function() {

          var newActive, newNext, prev;

          videos.children().each(function() {

            if ($(this).zIndex()<=1) {
              $(this).zIndex(0);
            }

          });

          if (videos.children().length>=3) {

            if (active.is(':last-child')) {
              
              newActive = videos.find('> div:first-child');
              newNext = newActive.next();
              prev = active.prev();
              
            } else if (active.next().is(':last-child')) {
              
              newActive = active.next();
              newNext = videos.find('> div:first-child');
              prev = active.prev();

            } else if (active.is(':first-child')) {

              newActive = active.next();
              newNext = newActive.next();
              prev = videos.find('> div:last-child');

            } else {
              newActive = active.next();
              newNext = newActive.next();
              prev = active.prev();
            }

            //Update z-index
            prev.zIndex(1);
            active.zIndex(2);
            newActive.zIndex(4);
            newNext.zIndex(2);

            //Remove old classes
            prev.removeClass('left');
            active.removeClass('middle');
            newActive.removeClass('right');

            //Add new classes
            active.addClass('left');
            newActive.addClass('middle');
            newNext.addClass('right');

            //Switch variables to new divs
            active = newActive;

          } else if (!active.is(':last-child')) {

            active.zIndex(2).removeClass('middle').addClass('left');
            active.next().zIndex(3).removeClass('right')
            .addClass('middle');
            active = active.next();

          }

        });

        btnLeft.click(function() {

          var newActive, newNext, prev;

          videos.children().each(function() {

            if ($(this).zIndex()<=1) {
              $(this).zIndex(0);
            }

          });

          if (videos.children().length>=3) {

            if (active.is(':first-child')) {
              
              newActive = videos.find('> div:last-child');
              newNext = newActive.prev();
              prev = active.next();
              
            } else if (active.prev().is(':first-child')) {
              
              newActive = active.prev();
              newNext = videos.find('> div:last-child');
              prev = active.next();

            } else if (active.is(':last-child')) {

              newActive = active.prev();
              newNext = newActive.prev();
              prev = videos.find('> div:first-child');

            } else {
              newActive = active.prev();
              newNext = newActive.prev();
              prev = active.next();
            }

            //Update z-index
            prev.zIndex(1);
            active.zIndex(2);
            newActive.zIndex(3);
            newNext.zIndex(2);

            //Remove old classes
            prev.removeClass('right');
            active.removeClass('middle');
            newActive.removeClass('left');

            //Add new classes
            active.addClass('right');
            newActive.addClass('middle');
            newNext.addClass('left');

            //Switch variables to new divs
            active = newActive;

          } else if (!active.is(':first-child')) {

            active.zIndex(2).removeClass('middle').addClass('right');
            active.prev().zIndex(3).removeClass('left').addClass('middle');
            active = active.prev();

          }

        });

        //RESIZE FUNCTIONALITY
        $timeout(function() {
          resizeFunction();
        });

        var resizeFunction = function() {

          if(typeof sizewait != 'undefined'){
            clearTimeout(sizewait);
          }
          var sizewait = setTimeout(function(){
            element.height(element.width()/3);
          },200);

        }

        $(window).off('resize',resizeFunction);
        $(window).on('resize',resizeFunction);

      }
    };
  }]);