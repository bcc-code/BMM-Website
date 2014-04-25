'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerFullscreen', ['bmmPlayer', '$timeout', function (bmmPlayer, $timeout) {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-player-fullscreen');

        element.click(function() {

          var results = bmmPlayer.setFullscreen();

          if (results) {
            element.addClass('active');
          } else {
            element.removeClass('active');
          }

        });

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

      }
    };
  }]);