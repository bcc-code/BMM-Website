'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerMediaslider', ['$timeout', function ($timeout) {
    return {
      template: '<div class="bmm-player-mediaslider-behind"></div>',
      compile : function() {
        return {
          pre : function(scope, element) {

            element.addClass('bmm-player-mediaslider');
            var behind = element.find('.bmm-player-mediaslider-behind'),
                length = '';
            behind.css({
              position: 'absolute',
              bottom: '0'
            });

            var initialize = function() {

              scope.$watch(function() {
                return element.attr('orientation');
              },function() {
     
                $timeout(function() {
                  build();
                });

              });

            };

            var build = function() {

              if (typeof element.attr('length')!=='undefined') {
                length = element.attr('length');
              }

              if (typeof element.attr('orientation') !== 'undefined'&&
                  element.attr('orientation') === 'vertical') {

                element.find('.ui-slider-handle').css({
                  left: ''
                });

                element.css({
                  width: '',
                  height: length
                });

                behind.css({
                  width: '100%',
                  height: '0'
                });

                element.slider({
                  orientation: 'vertical',
                  slide: function(e, ui) {
                    behind.css({ height: ui.value+'%' });
                  },
                  change: function(e, ui) {
                    behind.css({ height: ui.value+'%' });
                  }
                });

              } else {

                element.css({
                  width: length,
                  height: ''
                });

                behind.css({
                  width: '0',
                  height: '100%'
                });

                element.slider({
                  orientation: 'horizontal',
                  slide: function(e, ui) {
                    behind.css({ width: ui.value+'%' });
                  },
                  change: function(e, ui) {
                    behind.css({ width: ui.value+'%' });
                  },
                });

              }

            };

            initialize();

          }
        };
      }
    };
  }]);