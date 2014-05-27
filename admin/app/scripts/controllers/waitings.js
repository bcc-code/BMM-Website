'use strict';

angular.module('bmmApp')
  .controller('WaitingsCtrl', function ($scope, $filter, $route, bmmApi, bmmPlay, bmmFormatterTrack) {

    $scope.waitings = {};
    $scope.waitings.ready = []; //Correct and ready
    $scope.waitings.conflicts = [];
    $scope.waitings.missingTrack = []; //Correct
    $scope.waitings.missingAlbum = [];
    $scope.waitings.wrongId = [];
    $scope.status = 'Loading waitings, please wait...';

    bmmApi.fileUploadedGuessTracksGet().done(function(links) {

      $scope.$apply(function() {

        var albums = {};

        $.each(links.guessed, function(key) {

          //When album found, but no tracks
          if (this.length<1) {
            $scope.waitings.missingTrack.push(key);
          } else {

            //When tracks has waitings
            $.each(this, function() {

              var waiting = this;

              //Check if track in same language allready exists
              var extension = String(key).split('.').pop(),
                  type = 'not set',
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

              //Guess mime_type
              switch(extension) {
                case 'mp3': type = 'audio/mpeg'; break;
                case 'mp4': type = 'video/mp4'; break;
                case 'ogg': type = 'application/ogg'; break;
                case 'oga': type = 'application/ogg'; break;
                case 'ogv': type = 'application/ogg'; break;
                case 'webm': type = 'video/webm'; break;
              }

              //Check for conflict
              $.each(possibleConflicts, function() {

                //If conflict
                if (this.mime_type === type) {
                  conflict = true;
                  $scope.waitings.conflicts.push({
                    track: bmmFormatterTrack.resolve(waiting),
                    conflict: this
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
                  waiting.link = key;
                  var track = bmmFormatterTrack.resolve(waiting);
                  albums['id_'+waiting.parent_id].tracks['id_'+waiting.id].track = track;
                  albums['id_'+waiting.parent_id].album = {
                    title: track.albumTitle
                  };
                }

                //File
                albums['id_'+waiting.parent_id].tracks['id_'+waiting.id].files[waiting.language] = {
                  language: waiting.language,
                  link: key
                };

              }

            });

          }

        });

        var cntAlbum = 0, cntTrack;
        $.each(albums, function() {

          cntTrack = 0;
          $scope.waitings.ready[cntAlbum] = {};
          $scope.waitings.ready[cntAlbum].tracks = [];
          $scope.waitings.ready[cntAlbum].album = this.album;
          $.each(this.tracks, function() {

            $scope.waitings.ready[cntAlbum].tracks[cntTrack] = {};
            $scope.waitings.ready[cntAlbum].tracks[cntTrack].files = [];
            $scope.waitings.ready[cntAlbum].tracks[cntTrack].track = this.track;
            $.each(this.files, function() {
              $scope.waitings.ready[cntAlbum].tracks[cntTrack].files.push(this);
            });

            cntTrack++;
          });

          cntAlbum++;
        });

        $scope.waitings.missingAlbum = links.unknown_bmm_id;
        $scope.waitings.wrongId = links.unguessable;
        $scope.status = 'Waitings successfully loaded';

      });

    });

    $scope.playLinked = function(track) {
      bmmPlay.setPlay([track], 0);
    };

    $scope.playConflict = function(file) {

      var type = 'audio'
      if (file.mime_type ==='video/mp4') {
        type = 'video';
      }
      bmmPlay.setPlay([{
        title: 'Conflict file',
        subtitle: file.mime_type,
        language: '',
        cover: '',
        file: bmmApi.secureFile(file.url),
        duration: file.duration,
        type: type
      }], 0);
    };

    $scope.linkWaiting = function(link, id, lang, album, track, index) {

      bmmApi.fileUploadedNameLink(link, id, lang).done(function() {

        track.files.splice(index, 1);

      });
    };

    $scope.linkWaitings = function(tracks) {

      var promises = 0;
      $scope.status = 'Attempt to link tracks in album, please wait...';

      $.each(tracks, function() {

        var track = this;

        $.each(this.files, function() {

          promises++;

          bmmApi.fileUploadedNameLink(this.link, track.track.id, this.language).done(function() {
            promises--;
            if (promises===0) {
              $route.reload();
            }
          }).fail(function() {
            $route.reload();
          });

        });

      });

    };

  });
