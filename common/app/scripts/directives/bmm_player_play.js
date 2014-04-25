'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerPlay', ['bmmPlayer', function (bmmPlayer) {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-player-play');

        scope.$watch('bmmPlayer.getPlaying', function(state) {
          if (state) {
            element.addClass('active');
          } else {
            element.removeClass('active');
          }
        });

        element.click(function() {

          if (!element.hasClass('active')) {
            bmmPlayer.setPlay();
          } else {
            bmmPlayer.setPause();
          }

        });

      }
    };
  }]);