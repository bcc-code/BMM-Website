'use strict';

angular.module('bmmLibApp')
  .directive('clickElsewhere', ['$document', function ($document) {
    return {
      link: function postLink(scope, element, attr) {

        var elsewhere = true;

        element.on('click', function(e) {
          elsewhere = false
          $document.off('click', clickElsewhere);
          $document.on('click', clickElsewhere);
        });

        var clickElsewhere = function() {
          if (elsewhere) {
            scope.$apply(attr.clickElsewhere);
            $document.off('click', clickElsewhere);
          }
          elsewhere = true;
        };

      }
    };
  }]);