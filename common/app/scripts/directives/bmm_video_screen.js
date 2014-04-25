'use strict';

angular.module('bmmLibApp')
  .directive('bmmVideoScreen', [ '$compile', 'bmmPlayer', function ($compile, bmmPlayer) {
    return {
      template: '<div class="bmm-video-target">'+
                '</div>',
      compile : function() {
        return {
          pre : function(scope, element) {
            
            //PRESET
            element.addClass('bmm-video-screen');

          },
          post : function(scope, element) {

            bmmPlayer.initialize('.bmm-video-target');

            element.find('.bmm-video-target').append(
              $compile('<div bmm-video-fullscreen></div><div bmm-player-fullscreen></div>')
            (scope));

          }
        };
      }
    };
  }]);