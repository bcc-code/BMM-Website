'use strict';

angular.module('bmmApp')
  .controller('SearchCtrl', function (
    $scope,
    $location,
    $routeParams,
    _api,
    _track,
    _album,
    _init
    ) {

    $scope.results = [];
    $(window).off('scrollBottom');

    var searchFrom = 0, loading=true, end=false, loadAmount=80;

    //Ensure search field has the term
    $scope.$parent.bmm = {};
    $scope.$parent.bmm.term = $routeParams.term;
    //Reset search field on leave
    $scope.$on('$destroy', function() {
      $scope.$parent.bmm.term = '';
    });

    $scope.open = function(type, id) {
      $location.path('/'+type+'/'+id);
    };

    var search = function(_from) {

      if (typeof _from==='undefined') {
        _from = 0;
      }

      //SEARCH RESULTS
      _api.search($routeParams.term, {
        from: _from,
        size: loadAmount
      }).done(function(data) {

        var track,
          type,
          vid = false,
          cnt=0;

        $.each(data, function() {

          if (typeof this.type!=='undefined'&&this.type==='album') {
            type = 'album';
            track = _album.resolve(this);

            $scope.results.push({
              cover: track.cover,
              title: track.title,
              id: this.id,
              type: type,
              subtype: this.subtype,
              language: this.language,
              date: track.date,
              duration: track.duration,
              video: false
            });

          } else if(typeof this.type!=='undefined'&&this.type==='track') {
            type = 'track';
            track = _track.resolve(this);

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
                    relations.push({title: _init.translation.page.search.content, content: track.title});
                  }
                  if (track.bible!=='') {
                    relations.push({title: _init.translation.page.search.bibleVerse, content: track.bible});
                  }
                  if (track.albumTitle!=='') {
                    relations.push({title: _init.translation.page.search.album, content: track.albumTitle});
                  }

                  $scope.results.push({
                    cover: track.cover,
                    title: track.performers,
                    id: this.id,
                    type: type,
                    subtype: this.subtype,
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
                    language: this.language,
                    date: track.date,
                    duration: track.duration,
                    video: vid,
                    relations: [
                      {title: _init.translation.page.search.interprets, content: track.performers},
                      {title: _init.translation.page.search.album, content: track.parentTitle}
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
                language: this.language,
                date: track.date,
                duration: track.duration,
                video: vid,
                relations: [
                  {title: _init.translation.page.search.interprets, content: track.performers},
                  {title: _init.translation.page.search.album, content: track.parentTitle}
                ],
                track: track
              });

            }

          }
          else {
            // other types like contributor are not supported
          }

          cnt++;

        });

        loading = false;
        $('.bmm-loading').remove();
        searchFrom+=loadAmount;
        if (cnt<loadAmount) { end = true; }

        $scope.$apply();

      });

    };

    $(window).on('scrollBottom', function() {

      if (!loading&&!end) {

        $('[ng-view]').append('<div class="bmm-loading">'+_init.translation.general.loading+'</div>');
        loading = true;
        search(searchFrom);

      }

    });

    search();

  });
