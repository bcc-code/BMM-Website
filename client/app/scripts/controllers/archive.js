'use strict';

angular.module('bmmApp')
  .controller('ArchiveCtrl', function (
    $scope,
    $timeout,
    $location,
    bmmApi,
    bmmUser,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    bmmPlay
  ) {

    //Temporary solution. @todo - Dig into $routeProvider & resolve for a better solution
    $scope.$parent.$watch('loadEnd', function(loadEnd) {
      if (loadEnd) {
        init();
      }
    });

    var init = function() {

      $(window).off('scrollBottom');

      //FETCH ALL YEARS WHERE TRACKS WHERE RECORDED
      bmmApi.facetsTrackRecordedYears().done(function(data) {

        $scope.roleList = [];

        $.each(data, function() {

          $scope.roleList.push({
            roleName : this.year,
            roleId: this.year,
            collapsed: true,
            group: 'year',
            loadAttempt: false,
            children: []
          });

        });

        $scope.roleList.reverse();
        $scope.$apply();

      });

      //OPEN SELECTED TRACK / ALBUM
      $scope.$watch( 'tree.currentNode', function() {

        if( $scope.tree && angular.isObject($scope.tree.currentNode) ) {

          if ($scope.tree.currentNode.group==='album') {

            $location.path( '/album/'+$scope.tree.currentNode.roleId );

          } else if ($scope.tree.currentNode.group==='track') {

            bmmApi.trackGet(
              $scope.tree.currentNode.roleId,
              bmmUser.mediaLanguage).done(function(track) {

                track = bmmFormatterTrack.resolve(track);
                bmmPlay.setPlay([track], 0);

              });

          }

        }

      });

      //EXPAND ARCHIVE WITH NEW DATA
      $scope.$watch( 'tree.expandedNode', function() {

        if( $scope.tree && angular.isObject($scope.tree.expandedNode) ) {

          if ($scope.tree.expandedNode.group==='track') {
            bmmApi.trackGet(
              $scope.tree.expandedNode.roleId,
              bmmUser.mediaLanguage).done(function(track) {

                track = bmmFormatterTrack.resolve(track);
                bmmPlay.setPlay([track], 0);

              });

          } else if (!$scope.tree.expandedNode.loadAttempt) {

            $scope.tree.expandedNode.loadAttempt = true;

            //IF A YEAR IS OPENED, DISPLAY ALBUMS FOR THE WHOLE YEAR
            if ($scope.tree.expandedNode.group==='year') {

              bmmApi.albumTracksRecordedYear($scope.tree.expandedNode.roleId, {},
                bmmUser.mediaLanguage).done(function(data) {

                $scope.tree.expandedNode.children = [];
                $.each(data, function() {

                  $scope.tree.expandedNode.children.push({
                    roleName : this.title,
                    roleId: this.id,
                    collapsed: true,
                    group: 'album',
                    loadAttempt: false,
                    children: []
                  });

                });

                $scope.$apply();
                makeDraggable();

              });

            }

            //IF AN ALBUM IS OPENED, DISPLAY SUB ALBUMS AND TRACKS
            if ($scope.tree.expandedNode.group==='album') {

              bmmApi.albumGet(
                $scope.tree.expandedNode.roleId, bmmUser.mediaLanguage
              ).done(function(data) {

                var albums = [], tracks = [];

                $.each(data.children, function() {

                  if (typeof this.type!=='undefined') {
                    if (this.type==='album') {
                      albums.push(bmmFormatterAlbum.resolve(this));
                    } else if (this.type==='track') {
                      tracks.push(bmmFormatterTrack.resolve(this));
                    }
                  }

                });

                $scope.tree.expandedNode.children = [];

                $.each(tracks, function() {

                  $scope.tree.expandedNode.children.push({
                    roleName : this.combinedTitle,
                    roleId: this.id,
                    language: this.language,
                    collapsed: true,
                    group: 'track',
                    loadAttempt: false
                  });

                });

                $.each(albums, function() {

                  $scope.tree.expandedNode.children.push({
                    roleName : this.title,
                    roleId: this.id,
                    collapsed: true,
                    group: 'album',
                    loadAttempt: false,
                    children: []
                  });

                });

                $scope.$apply();
                makeDraggable();

              });

            }

          }

        }
      }, false);

      var makeDraggable = function() {

        $timeout(function() {

          var a,b,c; //Quickfix for wrong y-position while scrolling
          $('.draggable').draggable({
            helper: 'clone',
            appendTo: 'body',
            revert: 'invalid',
            scope: 'move',
            zIndex: '1000',
            scroll: true,
            distance: 20,
            cursorAt: {
              left: 20,
              top: 2+$('body').scrollTop()
            },
            start: function(e,ui) {
              a = ui.position.top;
              b = $('body').scrollTop();
              c = e.pageY;
            },
            drag: function(e,ui) {
              ui.position.top = a+$('body').scrollTop()-b+e.pageY-c;
            }
          });

          $('body').find('.bmm-playlist-private').droppable({
            scope: 'move',
            activeClass: 'active',
            hoverClass: 'hover',
            tolerance: 'pointer',
            drop: function(ev, ui) {

              bmmApi.userTrackCollectionLink($(this).attr('id'), [
                ui.draggable.attr('id')
              ], ui.draggable.attr('language'));

            }
          });

        }, 200);

      };
    };

  });
