'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerNext', ['bmmPlayer', function (bmmPlayer) {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-player-next').click(function() {
          bmmPlayer.setNext();
        });

      }
    };
  }]);