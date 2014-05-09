'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlaylist', ['$rootScope', 'bmmApi', function ($rootScope, bmmApi) {
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
          appendDragDrop();
        });

        scope.$watch('playlist', function() {
          appendDragDrop();
        });

        var appendDragDrop = function() {
          element.find('tbody').find('tr').each(function() {
            $(this).draggable({
              handle: '.drag',
              helper: 'clone',
              appendTo: 'body',
              revert: 'invalid',
              scope: 'move',
              zIndex: 100,
              distance: 10,
              scroll: true,
              cursorAt: {
                left: 2,
                top: 2
              }
            });
          });

          $('body').find('.bmm-playlist-private').droppable({
            scope: 'move',
            activeClass: 'active',
            hoverClass: 'hover',
            tolerance: 'pointer',
            drop: function(ev, ui) {
              
              bmmApi.userTrackCollectionLink($(this).attr('id'), [
                ui.draggable.attr('id') //@todo - make possible for multiple ids
              ], ui.draggable.attr('language')).fail(function() {

                $rootScope.$apply();

              });

            }
          });
        };

      }
    };
  }]);