'use strict';

angular.module('bmmLibApp')
  .factory('waitings', [ 'bmmFormatterTrack', function (bmmFormatterTrack) {

    var factory = {};

    factory.resolve = function(waitings) {

      var waitingsSorted = {},
          albums = {};

      waitingsSorted.ready =  []; //Correct and ready
      waitingsSorted.conflicts = [];
      waitingsSorted.missingTrack = []; //Correct album, but no track
      waitingsSorted.missingAlbum = [];
      waitingsSorted.wrongId = [];

      $.each(waitings.guessed, function(key) {

        //When album found, but no tracks
        if (this.length<1) {
          waitingsSorted.missingTrack.push(key);
        } else {

          //When tracks has waitings
          $.each(this, function() {

            var waiting = this, track;

            //Check if track in same language allready exists
            var extension = String(key).split('.').pop(),
              type = '',
              possibleConflicts = [],
              conflict = false;

            //Find mime_types allready in track
            if (typeof waiting.media!=='undefined'&&waiting.media.length>0) {
              $.each(waiting.media, function() {
                if (typeof this.files!=='undefined'&&this.files.length>0) {
                  $.each(this.files, function() {
                    possibleConflicts.push(this);
                  });
                }
              });
            }

            var mType = 'audio';

            //Guess mime_type
            switch(extension) {
              case 'mp3': type = 'audio/mpeg'; break;
              case 'mp4': type = 'video/mp4'; mType = 'video'; break;
              case 'ogg': type = 'application/ogg'; mType = 'video'; break;
              case 'oga': type = 'application/ogg'; break;
              case 'ogv': type = 'application/ogg'; mType = 'video'; break;
              case 'webm': type = 'video/webm'; mType = 'video'; break;
              case 'webmv': type = 'video/webm'; mType = 'video'; break;
              case 'webma': type = 'audio/webm'; break;
            }

            waiting.link = {};
            waiting.link.type = mType;
            waiting.link.file = key;
            waiting.link.mime_type = type;
            waiting.link.duration = 0;
            track = bmmFormatterTrack.resolve(waiting);

            //Check for conflict
            $.each(possibleConflicts, function() {

              //If conflict
              if (this.mime_type === type) {

                var _conflict = waiting;
                _conflict.link.type = mType;
                _conflict.link.file = this.url;
                _conflict.link.mime_type = this.mime_type;
                _conflict.link.duration = this.duration;
                _conflict = bmmFormatterTrack.resolve(_conflict);

                conflict = true;
                waitingsSorted.conflicts.push({
                  track: track,
                  conflict: _conflict
                });

                return false;
              }
            });

            if (!conflict) {

              //Album
              if (typeof albums['id_'+waiting.parent_id]==='undefined') {
                albums['id_'+waiting.parent_id] = {};
                albums['id_'+waiting.parent_id].tracks = {};
              }

              //Track
              if (typeof albums['id_'+waiting.parent_id].tracks['id_'+waiting.id]==='undefined') {
                albums['id_'+waiting.parent_id].tracks['id_'+waiting.id] = {};
                albums['id_'+waiting.parent_id].tracks['id_'+waiting.id].files = {};
                albums['id_'+waiting.parent_id].tracks['id_'+waiting.id].track = track;
                albums['id_'+waiting.parent_id].album = {
                  title: track.albumTitle
                };
              }

              //File
              albums['id_'+waiting.parent_id].tracks['id_'+waiting.id].files[waiting.language] = {
                language: waiting.language,
                link: key,
                track: track
              };

            }

          });

        }

      });

      var cntAlbum = 0, cntTrack;
      $.each(albums, function() {

        cntTrack = 0;
        waitingsSorted.ready[cntAlbum] = {};
        waitingsSorted.ready[cntAlbum].tracks = [];
        waitingsSorted.ready[cntAlbum].album = this.album;
        $.each(this.tracks, function() {

          waitingsSorted.ready[cntAlbum].tracks[cntTrack] = {};
          waitingsSorted.ready[cntAlbum].tracks[cntTrack].files = [];
          waitingsSorted.ready[cntAlbum].tracks[cntTrack].track = this.track;
          $.each(this.files, function() {
            waitingsSorted.ready[cntAlbum].tracks[cntTrack].files.push(this);
          });

          cntTrack++;
        });

        cntAlbum++;
      });

      waitingsSorted.missingAlbum = waitings.unknown_bmm_id;
      waitingsSorted.wrongId = waitings.unguessable;

      //Returns[ ready, conflicts, wrongId, missingAlbum, missingTrack ]

      return waitingsSorted;

    };

    return factory;

  }]);
