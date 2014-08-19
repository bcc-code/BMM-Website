'use strict';

angular.module('bmmLibApp')
  .directive('playlist', ['$rootScope', '_draggable', function ($rootScope, _draggable) {
    return {
      link: function postLink(scope, element) {

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

        element.on('dragdrop', makeDraggable);
        var makeDraggable = function() {
          _draggable.playlist(element, scope);
        };

      }
    };
  }]);