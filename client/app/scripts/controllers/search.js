'use strict';

angular.module('bmmApp')
  .controller('SearchCtrl', function (
    $scope,
    $location,
    $timeout,
    $routeParams,
    bmmApi,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    bmmPlaylist,
    bmmPlayer,
    bmmUser,
    draggable,
    bmmPlay
    ) {

    //Temporary solution. @todo - Dig into '$routeProvider & resolve' for a better solution
    $scope.$parent.$watch('loadEnd', function(loadEnd) {
      if (loadEnd) {
        init();
      }
    });

    var init = function() {

      $scope.results = [];
      $(window).off('scrollBottom');

      var searchFrom = 0, loading=true, end=false, loadAmount=80;

      $(window).on('scrollBottom', function() {

        if (!loading&&!end) {

          $('[ng-view]').append('<div class="bmm-loading">Laster...</div>');
          loading = true;
          search(searchFrom);

        }

      });

      //Ensure search field has the term
      $scope.$parent.bmm = {};
      $scope.$parent.bmm.term = $routeParams.term;
      //Reset search field on leave
      $scope.$on('$destroy', function() {
        $scope.$parent.bmm.term = '';
      });

      $scope.open = function(type, id, language, track) {
        if (type==='track') {

          //bmmApi.trackGet(id, {}, language).done(function(data) {
            //var track = bmmFormatterTrack.resolve(data);
            bmmPlay.setPlay([track], 0);
            //$scope.$apply();
          //});
        } else {
          $location.path('/'+type+'/'+id);
        }
      };

      var search = function(_from) {

        if (typeof _from==='undefined') {
          _from = 0;
        }

        //SEARCH RESULTS
        bmmApi.search($routeParams.term, {
          from: _from,
          size: loadAmount
        }, bmmUser.mediaLanguage).done(function(data) {

          var track,
              type,
              dragging,
              vid = false,
              cnt=0;

          $.each(data, function() {

            if (typeof this.type!=='undefined'&&this.type==='album') {
              type = 'album';
              dragging = 'false';
              track = bmmFormatterAlbum.resolve(this);

              $scope.results.push({
                cover: track.cover,
                title: track.title,
                id: this.id,
                type: type,
                subtype: this.subtype,
                language: this.language,
                date: track.date,
                duration: track.duration,
                video: false,
                draggable: dragging
              });

            } else {
              type = 'track';
              dragging = 'draggable';
              track = bmmFormatterTrack.resolve(this);

              if (track.subtype==='video') {
                vid = true;
              } else {
                vid = false;
              }

              if (typeof this.subtype!=='undefined') {

                switch(this.subtype) {

                  case 'speech':

                    var relations=[];
                    if (track.title!==''&&track.title!=='-') {
                      relations.push({title: 'Innhold', content: track.title});
                    }
                    if (track.bible!=='') {
                      relations.push({title: 'Bibelvers', content: track.bible});
                    }
                    if (track.albumTitle!=='') {
                      relations.push({title: 'Album', content: track.albumTitle});
                    }

                    $scope.results.push({
                      cover: track.cover,
                      title: track.performers,
                      id: this.id,
                      type: type,
                      subtype: this.subtype,
                      draggable: dragging,
                      language: this.language,
                      date: track.date,
                      duration: track.duration,
                      video: vid,
                      relations: relations,
                      track: track
                    });
                    break;
                  default:
                    $scope.results.push({
                      cover: track.cover,
                      title: track.combinedTitle,
                      id: this.id,
                      type: type,
                      subtype: this.subtype,
                      draggable: dragging,
                      language: this.language,
                      date: track.date,
                      duration: track.duration,
                      video: vid,
                      relations: [
                        {title: 'Interpreter', content: track.performers},
                        {title: 'Album', content: track.parentTitle}
                      ],
                      track: track
                    });
                    break;
                }

              } else {

                $scope.results.push({
                  cover: track.cover,
                  title: track.combinedTitle,
                  id: this.id,
                  type: type,
                  subtype: this.subtype,
                  draggable: dragging,
                  language: this.language,
                  date: track.date,
                  duration: track.duration,
                  video: vid,
                  relations: [
                    {title: 'Interpreter', content: track.performers},
                    {title: 'Album', content: track.parentTitle}
                  ],
                  track: track
                });

              }

            }

            cnt++;

          });

          var scope = $scope;
          $scope.$apply(function() {
            draggable.makeDraggable(scope);
          });

          loading = false;
          $('.bmm-loading').remove();
          searchFrom+=loadAmount;
          if (cnt<loadAmount) { end = true; }

        });

      };

      search();
      /*
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

      };*/
    };


  });
