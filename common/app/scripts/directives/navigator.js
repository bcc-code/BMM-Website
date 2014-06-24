'use strict';

angular.module('bmmLibApp')
  .directive('navigator', [function () {
    return {
      link: function postLink(scope, element) {

        scope.absolute = false;
        scope.fixed = false;
        scope.fixedSmall = false;
        scope.visible = false;

        //Fix navigation on scroll
        scope.fixed = false;

        $(window).scroll(function() {
          scope.$apply(function() {
            fixNav();
          });
        });

        var fixNav = function() {

          if ($('[navigator]').height()<$('[ng-view]').height()+$('header').height()) {
            if ($(document).scrollTop()>=$('header').height()+$('#sw-topbar').height()) {
              scope.fixedSmall = true;
            } else {
              scope.fixedSmall = false;
            }
            if ($(document).scrollTop()>=$('#sw-topbar').height()) {
              scope.absolute = false;
            } else {
              scope.absolute = true;
            }
            if ($(document).scrollTop()>=$('header').height()) {
              scope.fixed = true;
            } else {
              scope.fixed = false;
            }
          } else {
            scope.absolute = true;
            scope.fixed = false;
            scope.fixedSmall = false;
          }

        };
        fixNav();

      }
    };
  }]);