'use strict';

angular.module('bmmLibApp')
  .directive('sliderAlbum', ['$timeout', function ($timeout) {
    return {
      link: function postLink(scope, element) {

        element.addClass('bmm-slider-album');
        element.append('<div class="bmm-slider-album-leftLap"></div>');
        element.append('<div class="bmm-slider-album-rightLap"></div>');
        element.append('<div class="bmm-slider-album-prev"></div>');
        element.append('<div class="bmm-slider-album-next"></div>');

        var btnLeft = element.find('.bmm-slider-album-prev'),
            btnRight = element.find('.bmm-slider-album-next'),
            page = 0, margin;

        //SLIDE FUNCTIONALITY
        btnLeft.click(function() {

          if (page>0) {
            page--;
            redrawElements(true);
          }

        });

        btnRight.click(function() {

          if (element.find('li').length>((page*4)+4)) {
            page++;
            redrawElements(true);
          }

        });

        $timeout(function() {

          redrawElements();

          btnLeft.css({
            top: (element.height()/2)-(btnLeft.height()/2)
          });
          btnRight.css({
            top: (element.height()/2)-(btnRight.height()/2)
          });
          
        });

        $(window).resize( function() {

          redrawElements();

          btnLeft.css({
            top: (element.height()/2)-(btnLeft.height()/2)
          });
          btnRight.css({
            top: (element.height()/2)-(btnRight.height()/2)
          });

        });

        var redrawElements = function(animate) {

          var width = (element.find('ul').width()*0.23);
          var height = width;

          margin = (element.find('ul').width()*0.08)/5.0;

          element.height(height+(width*0.1));

          element.find('li').css({
            width: width,
            height: height
          });

          element.find('li').each(function(i) {

            if (typeof animate==='undefined'||!animate) {
              $(this).css({
                left: (($(this).width()+margin)*i)-
                      (($(this).width()+margin)*(page*4))+margin

              });
            } else {
              $(this).animate({
                left: (($(this).width()+margin)*i)-
                      (($(this).width()+margin)*(page*4))+margin

              },'fast');
            }

          });
        };

      }
    };
  }]);