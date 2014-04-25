'use strict';

angular.module('bmmLibApp')
  .directive('bmmVolumeMute', ['bmmPlayer', function (bmmPlayer) {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-volume-mute').click(function() {
          bmmPlayer.setMute();
        });

        element.click(function() {
        	element.toggleClass('muted');
        });

      }
    };
  }]);