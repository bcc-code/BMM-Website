'use strict';

angular.module('bmmLibApp')
  .directive('bmmTrackShare', [function () {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-track-share');

      }
    };
  }]);
