'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerVideo', [function () {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-player-video');

      }
    };
  }]);