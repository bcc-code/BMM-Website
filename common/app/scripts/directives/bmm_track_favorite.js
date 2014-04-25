'use strict';

angular.module('bmmLibApp')
  .directive('bmmTrackFavorite', [function () {
    return {
      link: function postLink(scope, element) {
        
        element.addClass('bmm-track-favorite');

      }
    };
  }]);