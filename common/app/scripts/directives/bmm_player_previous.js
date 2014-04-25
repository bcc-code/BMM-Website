'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerPrevious', ['bmmPlayer', function (bmmPlayer) {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-player-previous').click(function() {
          bmmPlayer.setPrevious();
        });

      }
    };
  }]);