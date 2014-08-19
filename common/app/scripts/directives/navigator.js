'use strict';

angular.module('bmmLibApp')
  .directive('navigator', ['$timeout', function ($timeout) {
    return {
      link: function postLink(scope, element) {

        /**
         * This fixes some styling issues on resize caused by the changing topbar
         * @todo - Experiment with CSS and try to leave this out, unwanted code..
         */

        scope.absolute = false;
        scope.fixed = false;
        scope.fixedSmall = false;
        scope.visible = false;

        var fixNav = function() {

          scope.$apply(function() {
            if ($('[navigator]').height()<(
                  $('[ng-view]').height()+
                  $('header').height()+
                  $('.push-messages').height()
                )) {
              if ($(document).scrollTop()>=(
                    $('header').height()+
                    $('#sw-topbar').height()+
                    $('.push-messages').height()
                )) {
                scope.fixedSmall = true;
              } else {
                scope.fixedSmall = false;
              }
              if ($(document).scrollTop()>=$('#sw-topbar').height()) {
                scope.absolute = false;
              } else {
                scope.absolute = true;
              }
              if ($(document).scrollTop()>=(
                    $('header').height()+
                    $('.push-messages').height()
                  )) {
                scope.fixed = true;
              } else {
                scope.fixed = false;
              }
            } else {
              scope.absolute = true;
              scope.fixed = false;
              scope.fixedSmall = false;
            }
          });

        };

        $timeout(fixNav);
        $(window).on('scroll', fixNav);

      }
    };
  }]);