'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerRepeat', ['bmmPlaylist', function (bmmPlaylist) {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-player-repeat');

        element.click(function() {
          if (!element.hasClass('active')) {
            bmmPlaylist.setRepeat(true);
            element.addClass('active');
          } else {
            bmmPlaylist.setRepeat(false);
            element.removeClass('active');
          }
        });

      }
    };
  }]);