'use strict';

angular.module('bmmLibApp')
  .factory('bmmPlay', ['bmmPlaylist', 'bmmPlayer', '$location', '$filter', 'bmmApi',
    function (bmmPlaylist, bmmPlayer, $location, $filter,  bmmApi) {
    
    var factory = {};

    factory.setPlay = function(playlist, index, play, timestamp) {
      if (typeof index==='undefined') {
        index = 0;
      }
      if (typeof play==='undefined') {
        play = true;
      }
      if (typeof timestamp==='undefined') {
        timestamp = 0;
      }
      var tracks = [], video, title, performers;

      $.each(playlist, function() {

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
          duration: this.duration,
          audios: this.audios,
          videos: this.videos,
          unknowns: this.unknowns,
          audio: this.audio,
          video: this.video,
          unknown: this.unknown,
          raw: this.raw,
          timestamp: timestamp
        });

      });

      bmmPlaylist.setTracks({
        tracks: tracks,
        index: index,
        url: $location.path()
      });

      if (play) {
        bmmPlayer.setSource(bmmPlaylist.getCurrent(), timestamp);
        bmmPlayer.setPlay(timestamp);
      }

    };

    return factory;

  }]);
