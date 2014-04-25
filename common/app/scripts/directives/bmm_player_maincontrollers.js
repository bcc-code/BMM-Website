'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerMaincontrollers', [function () {
    return {
      template: '<div bmm-player-repeat></div>'+
                '<div bmm-player-previous></div>'+
                '<div bmm-player-play></div>'+
                '<div bmm-player-next></div>'+
                '<div bmm-player-shuffle></div>',
      link: function postLink(scope, element) {
        
        element.addClass('bmm-player-maincontrollers');

      }
    };
  }]);