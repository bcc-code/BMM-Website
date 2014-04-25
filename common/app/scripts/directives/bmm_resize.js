'use strict';

angular.module('bmmLibApp')
  .directive('bmmResize', [function () {
    return {
      link: function postLink(scope, element) {

        element.resizable();

      }
    };
  }]);