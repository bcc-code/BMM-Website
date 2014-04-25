'use strict';

angular.module('bmmLibApp')
  .directive('bmmPlayerAbout', [ 'bmmApi', function (bmmApi) {
    return {
      template: '<div class="bmm-player-thumbnail" style="background-image: url({{background}});"></div>'+
				'<div title="{{title}}" class="bmm-player-title">{{title}}</div>'+
        '<div title="{{subtitle}}" class="bmm-player-subtitle">{{subtitle}}</div>'+
        '<div title="{{extra}}" class="bmm-player-extra">{{extra | bmmLanguage}}</div>',
      link: function postLink(scope, element, attrs) {
        element.addClass('bmm-player-about');

        var initialize = function() {
          if (typeof attrs.thumbnail!=='undefined') {
            element.find('.bmm-player-thumbnail').css({
              background: 'url("'+attrs.thumbnail+'")'
            });
          }

          scope.background = '';
          scope.title = '';
          scope.subtitle = '';
          scope.extra = '';
          element.attr('id', -1);

          scope.$watch('bmmPlayer.getCover', function(cover) {
            scope.background = cover;
          });

          scope.$watch('bmmPlayer.getTitle', function(title) {
            scope.title = title;
          });

          scope.$watch('bmmPlayer.getSubtitle', function(subtitle) {
            scope.subtitle = subtitle;
          });

          scope.$watch('bmmPlayer.getExtra', function(extra) {
            scope.extra = extra;
          });

          scope.$watch('bmmPlayer.getId', function(id) {
            element.attr('id', id);
          });

        };

        initialize();

        var a,b,c; //Quickfix for wrong y-position while scrolling
        var appendDragDrop = function() {
          if (element.attr('id')!==-1) {
            $(element).draggable({
              helper: 'clone',
              appendTo: '.bmm-main-container',
              revert: 'invalid',
              scope: 'move',
              distance: 10,
              scroll: true,
              start: function(e,ui) {
                a = ui.position.top;
                b = $('.bmm-container-main').scrollTop();
                c = e.pageY;
              },
              drag: function(e,ui) {
                ui.position.top = a+$('.bmm-container-main').scrollTop()-b+e.pageY-c;
              },
              cursorAt: {
                left: 2,
                top: 2
              }
            });

            $('body').find('.bmm-playlist-private').droppable({
              scope: 'move',
              activeClass: 'active',
              hoverClass: 'hover',
              tolerance: 'pointer',
              drop: function(ev, ui) {
                
                bmmApi.userTrackCollectionLink($(this).attr('id'), [
                  ui.draggable.attr('id') //@todo - make possible for multiple ids
                ], ui.draggable.attr('language')).fail(function() {

                  $rootScope.$apply();

                });

              }
            });
          }
        };

      }
    };
  }]);
