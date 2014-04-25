'use strict';

angular.module('bmmLibApp')
  .directive('bmmTrackTimer', [function () {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-track-timer');

      }
    };
  }]);