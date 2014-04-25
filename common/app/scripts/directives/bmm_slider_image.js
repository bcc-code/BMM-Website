'use strict';

angular.module('bmmLibApp')
  .directive('bmmSliderImage', ['$timeout', function ($timeout) {
    return {
      link: function postLink(scope, element) {

        element.addClass('bmm-slider-image');
        element.append('<div class="bmm-slider-image-prev"></div>');
        element.append('<div class="bmm-slider-image-next"></div>');

        var btnLeft = element.find('.bmm-slider-image-prev'),
            btnRight = element.find('.bmm-slider-image-next'),
            page = 0;

        //SLIDE FUNCTIONALITY
        btnLeft.click(function() {

          if (page>0) {
            page--;
            redrawElements(true);
          }

        });

        btnRight.click(function() {

          if ((element.find('li').length-1)>page) {
            page++;
            redrawElements(true);
          }

        });

        $timeout(function() {

          redrawElements();

          element.height(element.find('li').width()/2.8);
          btnLeft.css({
            top: (element.height()/2)-(btnLeft.height()/2)
          });
          btnRight.css({
            top: (element.height()/2)-(btnRight.height()/2)
          });
          
        });

        $(window).resize( function() {

          redrawElements();

          element.height(element.find('li').width()/2.8);
          btnLeft.css({
            top: (element.height()/2)-(btnLeft.height()/2)
          });
          btnRight.css({
            top: (element.height()/2)-(btnRight.height()/2)
          });

        });

        var redrawElements = function(animate) {

          element.find('li').each(function(i) {

            if (typeof animate==='undefined'||!animate) {
              $(this).css({

                left: ($(this).width()*i)-($(this).width()*page)

              });
            } else {
              $(this).animate({

                left: ($(this).width()*i)-($(this).width()*page)

              },'fast');
            }

          });
        };

      }
    };
  }]);