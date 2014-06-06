'use strict';

angular.module('bmmLibApp')
  .factory('bmmPlay', ['bmmPlaylist', 'bmmPlayer', '$location', '$filter', 'bmmApi',
    function (bmmPlaylist, bmmPlayer, $location, $filter,  bmmApi) {
    
    var factory = {};

    factory.setPlay = function(playlist, index, play) {
      if (typeof index==='undefined') {
        index = 0;
      }
      if (typeof play==='undefined') {
        play = true;
      }
      var tracks = [], video, title, performers;

      $.each(playlist, function() {

        video = false;
        if (this.type==='video') {
          video = true;
        }

        title = this.title;
        performers = this.performers;
        if (this.subtype==='speech') {
          title = this.performers;
          performers = this.title;
        }

        tracks.push({
          id: this.id,
          title: title,
          subtitle: performers,
          language: this.language,
          cover: $filter('bmmCover')(this.cover,this.subtype),
          url: this.file,
          duration: this.duration,
          video: video,
          raw: this.raw
        });

      });

      bmmPlaylist.setTracks({
        tracks: tracks,
        index: index,
        url: $location.path()
      });

      if (play) {
        bmmPlayer.setSource(bmmPlaylist.getCurrent());
        bmmPlayer.setPlay();
      }

    };

    return factory;

  }]);
