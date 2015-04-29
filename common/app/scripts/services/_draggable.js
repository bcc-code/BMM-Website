'use strict';

angular.module('bmmLibApp')
  .factory('_draggable', [ '$timeout', '_api', function ($timeout, _api) {

    var factory = {};

    //If ie, make body relative (or y position gets wrong while scroll)
    if (window.navigator.userAgent.indexOf("MSIE ") > 0 ||
      !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      $(document.body).css('position','relative');
    }

    var resizer = function(target) {
        if ($('#size-detector').width()<2&&!$('.ui-draggable').draggable('option', 'disabled')) {
          $('.ui-draggable').draggable('disable');
        } else if ($('#size-detector').width()>1&&$('.ui-draggable').draggable('option', 'disabled')) {
          $('.ui-draggable').draggable('enable');
        }
    };

    var draggableToggle = function(target) {

      resizer(target);

      //Attempt to solve bug with a latest list in iphone
      $timeout(function() {
        $(window).trigger('resize');
      }, 1000);

      $(window).off('resize', resizer);
      $(window).bind('resize', function() {
        if(typeof sizewait !== 'undefined'){
          clearTimeout(sizewait);
        }
        var sizewait = setTimeout(function(){
          resizer(target);
        },200);
      });

    };

    factory.makeDraggable = function($scope) {

      var navStatus=false;
      $timeout(function() {
        $('.draggable').draggable({
          helper: 'clone',
          appendTo: 'body',
          revert: 'invalid',
          scope: 'move',
          zIndex: '1000',
          distance: 20,
          refreshPositions: true,
          scroll: true,
          cursorAt: {
            left: 20
          },
          start: function() {
            navStatus = $scope.$parent.visible;
            $scope.$parent.$apply(function() {
              $scope.$parent.visible = true;
              if ($('body').scrollTop()<$('[ng-view]').offset().top) {
                $('body').animate({
                  scrollTop: $('[ng-view]').offset().top
                }, 200);
              }
              $('[navigator]').animate({
                scrollTop: $('.playlists-add').offset().top
              }, 2000);
            });
          },
          stop: function() {
            $scope.$parent.$apply(function() {
              $scope.$parent.visible = navStatus;
            });
          }

        });

        draggableToggle('.draggable');

        $('body').find('.bmm-playlist-private').droppable({
          scope: 'move',
          activeClass: 'active',
          hoverClass: 'hover',
          tolerance: 'pointer',
          drop: function(ev, ui) {

            _api.userTrackCollectionLink($(this).attr('id'), [
              ui.draggable.attr('id')
            ]);

          }
        });

      }, 1000);

    };

    factory.playlist = function(playlist, $scope) {

      $timeout(function() {
        var navStatus=false;
        playlist.find('tbody').find('tr').each(function() {
          $(this).draggable({
            handle: '.drag',
            helper: 'clone',
            appendTo: 'body',
            revert: 'invalid',
            scope: 'move',
            refreshPositions: true,
            zIndex: 100,
            distance: 10,
            scroll: true,
            cursorAt: {
              left: 2,
              top: 2
            },
            start: function() {
              navStatus = $scope.$parent.visible;
              $scope.$parent.$apply(function() {
                $scope.$parent.visible = true;
                if ($('body').scrollTop()<$('[ng-view]').offset().top) {
                  $('body').animate({
                    scrollTop: $('[ng-view]').offset().top
                  }, 200);
                }
                $('[navigator]').animate({
                  scrollTop: $('.playlists-add').offset().top
                }, 2000);
              });
            },
            stop: function() {
              $scope.$parent.$apply(function() {
                $scope.$parent.visible = navStatus;
              });
            }
          });

        });

        draggableToggle(playlist);

        $('body').find('.bmm-playlist-private').droppable({
          scope: 'move',
          activeClass: 'active',
          hoverClass: 'hover',
          tolerance: 'pointer',
          drop: function(ev, ui) {

            _api.userTrackCollectionLink($(this).attr('id'), [
                ui.draggable.attr('id') //@todo - make possible for multiple ids
              ]).fail(function() {

              $rootScope.$apply();

            });

          }
        });
      }, 1000);
    }

    return factory;
  }]);