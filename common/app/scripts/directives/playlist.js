'use strict';

angular.module('bmmLibApp')
  .directive('playlist', function ($rootScope, $timeout, _draggable) {
    return {
      link: function postLink(scope, element) {

        element.addClass('draggable-playlist');

        scope.sortableOptions = {
          update: makeDraggable,
          handle: '.sort_handle',
          axis: 'y',
          helper: function(e, ui) {
            ui.children().each(function() {
              $(this).width($(this).width());
            });
            return ui;
          },
          stop: function(e, ui) {
            ui.item.children().each(function() {
              $(this).width('');
            });
          }
        };

        var makeDraggable = function() {
          _draggable.playlist(element, scope);
        };

        element.on('dragdrop', function() {
          makeDraggable();
        });

      }
    };
  });