'use strict';

angular.module('bmmLibApp')
  .directive('bmmVolumeController', ['$timeout', function ($timeout) {
    return {
      template: '<div bmm-volume-slider></div>'+
                '<div bmm-volume-mute></div>',
      compile : function() {
        return {
          pre : function(scope, element) {
            
            //DEFINITIONS
            var slider;

            //PRESET
            element.addClass('bmm-volume-controller');

            //INITIALIZE
            $timeout(function() {
              slider = element.find('.bmm-volume-slider');
              element.children().css('float', 'left');
            });
            
          }
        };
      }
    };
  }]);