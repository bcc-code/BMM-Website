'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerShuffle', ['bmmPlaylist', function (bmmPlaylist) {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-player-shuffle');

        element.click(function() {
          if (!element.hasClass('active')) {
            bmmPlaylist.setShuffle(true);
            element.addClass('active');
          } else {
            bmmPlaylist.setShuffle(false);
            element.removeClass('active');
          }
        });

      }
    };
  }]);