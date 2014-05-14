'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlaylist', ['$rootScope', 'bmmApi', 'draggable', function ($rootScope, bmmApi, draggable) {
    return {
      link: function postLink(scope, element) {

        scope.sortableOptions = {
          update: function() {
            scope.$apply('playlist');
          },
          handle: '.sort',
          axis: 'y'
        };

        element.addClass('bmm-playlist');

        $('.bmm-playlist').on('dragdrop', function() {
          draggable.playlist(element, scope);
        });

        scope.$watch('playlist', function() {
          draggable.playlist(element, scope);
        });

      }
    };
  }]);