'use strict';

angular.module('bmmLibApp')
  .directive('bmmVolumeMax', ['bmmPlayer', function (bmmPlayer) {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-volume-max');

        element.click(function() {
          bmmPlayer.setMute(false);
          bmmPlayer.setVolume(1);
        });

      }
    };
  }]);