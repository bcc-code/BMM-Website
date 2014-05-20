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
    init
    ) {

    $scope.$parent.contributors = false;
    $scope.results = [];
    $('.bmm-view').off('scrollBottom');

    var searchFrom = 0, loading=true;

    $('.bmm-view').on('scrollBottom', function() {

      if (!loading) {

        $('.bmm-view').append('<div class="bmm-loading">Laster...</div>');
        loading = true;
        search(searchFrom);

      }

    });

    $scope.open = function(type, id) {
      $location.path('/'+type+'/'+id);
    };

    var search = function(_from) {

      if (typeof _from==='undefined') {
        _from = 0;
      }

      //SEARCH RESULTS
      bmmApi.search($routeParams.term, {
        unpublished: 'show',
        from: _from,
        size: 20
      }, init.mediaLanguage).done(function(data) {

        var track,
            type,
            vid = false;

        $.each(data, function() {

          if (typeof this.type!=='undefined'&&this.type==='album') {
            type = 'album';
            track = bmmFormatterAlbum.resolve(this);

            $scope.results.push({
              cover: track.cover,
              title: track.title,
              id: this.id,
              type: type,
              subtype: this.subtype,
              language: this.language,
              video: false
            });

          } else {
            type = 'track';
            track = bmmFormatterTrack.resolve(this);

            if (track.subtype==='video') {
              vid = true;
            } else {
              vid = false;
            }

            if (typeof this.subtype!=='undefined') {

              switch(this.subtype) {

                case 'speech':
                  $scope.results.push({
                    cover: track.cover,
                    title: track.performers,
                    id: this.id,
                    type: type,
                    subtype: this.subtype,
                    language: this.language,
                    video: vid,
                    relations: [
                      {title: 'Innhold', content: track.title},
                      {title: 'Bibelvers', content: track.bible},
                      {title: 'Album', content: track.parentTitle}
                    ]
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
                    video: vid,
                    relations: [
                      {title: 'Interpreter', content: track.performers},
                      {title: 'Album', content: track.parentTitle}
                    ]
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
                video: vid,
                relations: [
                  {title: 'Interpreter', content: track.performers},
                  {title: 'Album', content: track.parentTitle}
                ]
              });

            }

          }

        });

        $scope.$apply();
        loading = false;
        $('.bmm-loading').remove();
        searchFrom+=20;

      });

    };

    search();
    
  });