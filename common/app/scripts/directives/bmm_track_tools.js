'use strict';

angular.module('bmmLibApp')
  .directive('bmmTrackTools', ['bmmPlayer', function (bmmPlayer) {
    return {
      template: '<div bmm-track-favorite></div>'+
                '<div bmm-track-timer></div>'+
                '<div bmm-track-share></div>'+
                '<a download href="{{file}}?download=1"><div bmm-track-download></div></a>'+
                '<div ng-show="video" bmm-player-video></div>',
      link: function postLink(scope, element) {
        
        element.addClass('bmm-track-tools');

        scope.$watch('bmmPlayer.isVideo', function(is) {
          scope.video = is;
        });

      }
    };
  }]);