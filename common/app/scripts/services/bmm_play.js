'use strict';

angular.module('bmmLibApp')
  .factory('bmmPlay', ['bmmPlaylist', 'bmmPlayer', '$location', '$filter', 'bmmUser', 'bmmApi',
    function (bmmPlaylist, bmmPlayer, $location, $filter, bmmUser,  bmmApi) {
    
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

        var file = this.file;

        //Add exception for ie (have problem with verification)
        var ie = function() {
          if (window.navigator.userAgent.indexOf("MSIE ") > 0 ||
            !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            $(document.body).css('position','relative');
            return true;
          } else {
            return false;
          }
        };

        //if (!ie()) {
          //file = file.replace('://','://'+bmmApi.getCredentials()+'@');
        //}

        tracks.push({
          id: this.id,
          title: title,
          subtitle: performers,
          extra: this.language,
          cover: $filter('bmmCover')(this.cover,this.subtype),
          url: file,
          duration: this.duration,
          video: video
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
