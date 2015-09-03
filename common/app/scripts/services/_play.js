'use strict';

angular.module('bmmLibApp')
  .factory('_play', function (_playlist, _player, $location, $filter,  _api) {
    
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
          cover: $filter('_cover')(this.cover,this.subtype),
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

      _playlist.setTracks({
        tracks: tracks,
        index: index,
        url: $location.path()
      });

      if (play) {
        _player.setSource(_playlist.getCurrent(), timestamp);
        _player.setPlay(timestamp);
      }

    };

    return factory;

  });
