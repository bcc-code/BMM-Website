'use strict';

angular.module('bmmLibApp')
  .directive('clickElsewhere', ['$document', function ($document) {
    return {
      link: function postLink(scope, element, attr) {

        /**
         * Use like:
         * <div click-elsewhere="yourFunction();"></div>
         * With optional attribute:(Explained in code)
         * <div click-elsewhere="yourFunction();" always></div>
         */

        var elsewhere = true;

        if (typeof attr.always==='undefined'||!attr.always) {
          //clickElsewhere listener is created on click and killed on clickElsewhere
          //Using alot of directives with this option doesnt affect the performance
          element.on('click', function(e) {
            elsewhere = false
            $document.off('click', clickElsewhere);
            $document.on('click', clickElsewhere);
          });
        } else {
          //clickElsewhereAlways listener will be created instantly and never killed
          //Warning! Using alot of directives with this option makes bad performance
          $document.on('click', clickElsewhereAlways);
        }

        var clickElsewhere = function() {
          if (elsewhere) {
            scope.$apply(attr.clickElsewhere);
            $document.off('click', clickElsewhere);
          }
          elsewhere = true;
        };

        var clickElsewhereAlways = function() {
          scope.$apply(attr.clickElsewhere);
        };

      }
    };
  }]);